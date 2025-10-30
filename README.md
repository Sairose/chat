# CHAT

A full-stack chat and admin platform built with **MERN stack** (MongoDB, Express, React, Node.js) featuring real-time chat with **Socket.IO**, JWT authentication, user roles (admin, user), and user management.

---

## **Features**

- User registration & login
- Admin login
- JWT-based authentication
- Real-time global chat using Socket.IO
- Admin panel:
  - View total users & total chats
  - Edit user info
  - Delete users
- Logout functionality (clears cookie & localStorage)
- Role-based access control:
  - Admin-only pages
  - User-only pages
- Environment variable support via `.env`

---

## **Project Setup**

cd backend
npm install
cp .env.example .env
# Fill in your .env values
npm run dev

cd frontend
npm install
npm start

