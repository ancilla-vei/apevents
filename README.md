# 🎉 AP Events – Event Management System

A full-stack MERN (MongoDB, Express, React, Node.js) event management platform for **AP Events**, a Mangaluru-based event company.

---

## ✨ Features

### 🌐 Public Website
- Hero section with background image/video, company title & tagline
- About section with stats and core values
- Dynamic services list (managed by admin)
- Event categories showcase
- Photo gallery
- Client testimonials (admin-approved)
- Contact section with enquiry form

### 👤 Customer Portal
- Register/Login via phone + password
- **My Bookings** – submit & track event bookings
- **Quotations** – view price estimates from admin
- **Messages** – live chat with admin
- **Profile** – edit details, change password, leave reviews

### 🛠 Admin Dashboard
- **Bookings** – view all bookings, update status
- **Quotations** – create itemized estimates for customers
- **Testimonials** – approve or reject customer reviews
- **Enquiries** – reply to contact form submissions
- **Messages** – chat with any customer
- **Services** – add/edit/delete services with images
- **Categories** – event category cards with photos
- **Gallery** – upload event showcase photos
- **Customers** – manage all registered users
- **Settings** – company info, contact, branding, colors, logo, background

---

## 🚀 Quick Start

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (or local MongoDB)

### 1. Clone / Extract
```bash
cd ap-events
```

### 2. Backend Setup
```bash
cd backend
cp .env.example .env
# Edit .env with your MongoDB URI and JWT secret
npm install
npm run dev
```

### 3. Frontend Setup
```bash
cd frontend
npm install
npm start
```

### 4. Or run both together from root
```bash
npm install          # installs concurrently
npm run install-all  # installs backend + frontend deps
npm run dev          # starts both servers
```

---

## 🔧 Environment Variables

Create `backend/.env` from `backend/.env.example`:

```env
PORT=5000
MONGODB_URI=mongodb+srv://<user>:<pass>@cluster.mongodb.net/ap-events
JWT_SECRET=your_secret_key_here
JWT_EXPIRE=7d
NODE_ENV=development
ADMIN_PHONE=7411185509
ADMIN_PASSWORD=Pachu@123
```

---

## 👑 Default Admin Credentials

| Field    | Value        |
|----------|--------------|
| Phone    | `7411185509` |
| Password | `Pachu@123`  |

> The admin account is auto-created on first server start.

---

## 🌐 URLs

| Service   | URL                          |
|-----------|------------------------------|
| Frontend  | http://localhost:3000         |
| Backend   | http://localhost:5000         |
| Admin     | http://localhost:3000/admin   |
| Customer  | http://localhost:3000/dashboard |

---

## 📁 Project Structure

```
ap-events/
├── backend/
│   ├── controllers/     # Business logic
│   ├── middleware/       # Auth, upload
│   ├── models/           # Mongoose schemas
│   ├── routes/           # Express routes
│   ├── uploads/          # Uploaded images (auto-created)
│   ├── server.js
│   └── .env.example
└── frontend/
    └── src/
        ├── context/      # Auth & Theme context
        ├── pages/
        │   ├── public/   # HomePage, Login, Register
        │   ├── customer/ # Dashboard, Bookings, etc.
        │   └── admin/    # All admin pages
        ├── components/
        ├── utils/
        └── App.js
```

---

## 🎨 Theme

- **Primary color**: Maroon (`#800000`)
- **Accent color**: Gold (`#ffd700`)
- **Light/Dark mode**: Toggle available in navbar and dashboards
- **Font**: Playfair Display (headings) + Inter (body)

---

## ☁️ Deployment

### Backend (e.g. Render / Railway)
1. Set environment variables in dashboard
2. Set build command: `npm install`
3. Set start command: `node server.js`
4. Set `FRONTEND_URL` to your frontend domain

### Frontend (Netlify / Vercel)
1. Build command: `npm run build`
2. Publish directory: `build`
3. Set `REACT_APP_API_URL=https://your-backend.com/api`

---

## 📌 API Endpoints Summary

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/register` | Customer registration |
| POST | `/api/auth/login` | Login (admin + customer) |
| GET | `/api/auth/me` | Current user |
| GET/POST | `/api/bookings` | Bookings CRUD |
| GET/POST | `/api/quotations` | Quotations CRUD |
| GET/POST | `/api/testimonials` | Reviews |
| GET/POST | `/api/enquiries` | Enquiry form |
| GET/POST | `/api/services` | Services |
| GET/POST | `/api/categories` | Event categories |
| GET/POST | `/api/gallery` | Gallery images |
| GET/POST | `/api/messages` | Chat messages |
| GET | `/api/customers` | Customer list (admin) |
| GET/PUT | `/api/settings` | Website settings |

---

## 🛡 Security

- JWT-based authentication
- Role-based access control (admin / customer)
- Password hashing with bcryptjs
- File upload type/size validation

---

Built with ❤️ for AP Events, Mangaluru.
