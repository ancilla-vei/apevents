import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial().primaryKey(),
  name: text().notNull(),
  phone: text().notNull().unique(),
  email: text(),
  address: text().default(""),
  passwordHash: text("password_hash").notNull(),
  role: text().notNull().default("customer"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});
