import type { Config, Context } from "@netlify/functions";
import crypto from "node:crypto";
import jwt from "jsonwebtoken";
import { eq } from "drizzle-orm";
import { db } from "../../db/index.js";
import { users } from "../../db/schema.js";

const tokenSecret =
  process.env.JWT_SECRET ||
  process.env.NETLIFY_AUTH_SECRET ||
  process.env.SECRET_KEY ||
  process.env.NETLIFY_DATABASE_URL ||
  process.env.DATABASE_URL ||
  "ap-events-local-development-secret";

type UserRow = typeof users.$inferSelect;

function json(data: unknown, status = 200) {
  return Response.json(data, { status });
}

function publicUser(user: UserRow) {
  return {
    id: user.id,
    _id: String(user.id),
    name: user.name,
    phone: user.phone,
    email: user.email || "",
    address: user.address || "",
    role: user.role,
  };
}

function normalizePhone(phone: unknown) {
  return String(phone || "").trim();
}

function hashPassword(password: string, salt = crypto.randomBytes(16).toString("hex")) {
  const hash = crypto.pbkdf2Sync(password, salt, 120000, 64, "sha512").toString("hex");
  return `${salt}:${hash}`;
}

function verifyPassword(password: string, storedHash: string) {
  const [salt, hash] = storedHash.split(":");
  if (!salt || !hash) return false;

  const candidate = hashPassword(password, salt).split(":")[1];
  return crypto.timingSafeEqual(Buffer.from(candidate, "hex"), Buffer.from(hash, "hex"));
}

function createToken(user: UserRow) {
  return jwt.sign({ sub: String(user.id), role: user.role }, tokenSecret, { expiresIn: "7d" });
}

async function getCurrentUser(req: Request) {
  const authHeader = req.headers.get("authorization") || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";
  if (!token) return null;

  try {
    const payload = jwt.verify(token, tokenSecret) as jwt.JwtPayload;
    const userId = Number(payload.sub);
    if (!Number.isInteger(userId)) return null;

    const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    return user || null;
  } catch {
    return null;
  }
}

async function requireUser(req: Request) {
  const user = await getCurrentUser(req);
  if (!user) return { response: json({ message: "Please log in again" }, 401), user: null };
  return { response: null, user };
}

export default async function handler(req: Request, context: Context) {
  const action = context.params.action;

  try {
    if (req.method === "POST" && action === "register") {
      const body = await req.json();
      const name = String(body.name || "").trim();
      const phone = normalizePhone(body.phone);
      const password = String(body.password || "");
      const email = String(body.email || "").trim();

      if (!name || !phone || password.length < 6) {
        return json({ message: "Name, phone, and a 6 character password are required" }, 400);
      }

      const [existing] = await db.select().from(users).where(eq(users.phone, phone)).limit(1);
      if (existing) return json({ message: "An account with this phone already exists" }, 409);

      const [user] = await db
        .insert(users)
        .values({ name, phone, email, passwordHash: hashPassword(password), role: "customer" })
        .returning();

      return json({ token: createToken(user), user: publicUser(user) }, 201);
    }

    if (req.method === "POST" && action === "login") {
      const body = await req.json();
      const phone = normalizePhone(body.phone);
      const password = String(body.password || "");

      const [user] = await db.select().from(users).where(eq(users.phone, phone)).limit(1);
      if (!user || !verifyPassword(password, user.passwordHash)) {
        return json({ message: "Invalid phone or password" }, 401);
      }

      return json({ token: createToken(user), user: publicUser(user) });
    }

    if (req.method === "GET" && action === "me") {
      const { response, user } = await requireUser(req);
      if (response) return response;
      return json(publicUser(user));
    }

    if (req.method === "PUT" && action === "profile") {
      const { response, user } = await requireUser(req);
      if (response) return response;

      const body = await req.json();
      const [updated] = await db
        .update(users)
        .set({
          name: String(body.name || user.name).trim(),
          email: String(body.email || "").trim(),
          address: String(body.address || "").trim(),
          updatedAt: new Date(),
        })
        .where(eq(users.id, user.id))
        .returning();

      return json(publicUser(updated));
    }

    if (req.method === "PUT" && action === "change-password") {
      const { response, user } = await requireUser(req);
      if (response) return response;

      const body = await req.json();
      const currentPassword = String(body.currentPassword || "");
      const newPassword = String(body.newPassword || "");

      if (!verifyPassword(currentPassword, user.passwordHash)) {
        return json({ message: "Current password is incorrect" }, 400);
      }
      if (newPassword.length < 6) {
        return json({ message: "Password must be at least 6 characters" }, 400);
      }

      await db
        .update(users)
        .set({ passwordHash: hashPassword(newPassword), updatedAt: new Date() })
        .where(eq(users.id, user.id));

      return json({ message: "Password changed" });
    }

    return json({ message: "Not found" }, 404);
  } catch (error) {
    console.error("Auth API error", error);
    return json({ message: "Authentication service is unavailable" }, 500);
  }
}

export const config: Config = {
  path: "/api/auth/:action",
};
