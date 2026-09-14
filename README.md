# 🏨 Hotel Management System

A professional Hotel Management System (HMS) built with the MERN stack (MongoDB, Express, React, Node.js). This project is being developed **incrementally** — feature by feature — following a realistic professional software workflow with Git/GitHub discipline.

---

## 📌 Project Overview

Hotels today still rely on spreadsheets and paperwork for operations. This system replaces that by providing one central platform to manage:

- Rooms & availability
- Guests & check-in / check-out
- Reservations & double-booking prevention
- Billing & payments
- Housekeeping
- Restaurant / POS
- Inventory
- Staff management
- Maintenance
- Reports & analytics
- Notifications

The final product will have both a **polished public hotel website** (guest-facing) and a **modern admin dashboard** (staff-facing).

---

## 🧩 Features (Roadmap)

| Phase | Feature | Status |
|-------|---------|--------|
| 1 | Project initialization (repo, README, gitignore, LICENSE) | ✅ Done |
| 2 | Backend initialization (Express + health API) | ⏳ Next |
| 3 | Frontend initialization (React + Vite + Tailwind) | ⏳ |
| – | Frontend ↔ Backend connection (Axios health check) | ⏳ |
| 4 | Database setup (MongoDB Atlas + Mongoose) | ⏳ |
| 5 | Authentication & Authorization (JWT + RBAC) | ⏳ |
| 6 | Room management | ⏳ |
| 7 | Guest management | ⏳ |
| 8 | Reservation management | ⏳ |
| 9 | Check-in / Check-out | ⏳ |
| 10 | Billing & payments | ⏳ |
| 11 | Housekeeping | ⏳ |
| 12 | Restaurant / POS | ⏳ |
| 13 | Inventory | ⏳ |
| 14 | Staff management | ⏳ |
| 15 | Maintenance | ⏳ |
| 16 | Reports & analytics | ⏳ |
| 17 | Notifications | ⏳ |
| 18 | Admin dashboard UI | ⏳ |
| 19 | Public hotel website | ⏳ |

---

## 🛠 Technologies

### Frontend
- **React.js** (with Vite)
- **Tailwind CSS**
- **React Router**
- **Axios**

### Backend
- **Node.js** + **Express.js**
- **JWT Authentication**
- **bcrypt** password hashing
- Role-based access control (RBAC) middleware

### Database
- **MongoDB** (Atlas) + **Mongoose ODM**

### Tools
- Git & GitHub (branching strategy with PRs)
- Postman / Thunder Client for API testing

---

## 🏗 Architecture

```
                 HOTEL WEBSITE (React)
                       │
                       ▼ (Axios / REST)
                 Express REST API
                       │
          ┌────────────┼────────────┐
          ▼            ▼            ▼
     Controllers     Services     Middleware
                       │
                       ▼ (Mongoose ODM)
                    MongoDB
```

## 📁 Folder Structure

```text
hotel-management-system/
│
├── server/                    ← Backend (Express API)
│   └── src/
│       ├── config/
│       ├── controllers/
│       ├── middleware/
│       ├── models/
│       ├── routes/
│       ├── services/
│       ├── utils/
│       ├── validators/
│       ├── app.js
│       └── server.js
│
├── client/                    ← Frontend (React + Vite)
│   └── src/
│       ├── assets/
│       ├── components/
│       ├── layouts/
│       ├── pages/
│       ├── routes/
│       ├── services/
│       ├── hooks/
│       ├── context/
│       ├── utils/
│       ├── App.jsx
│       └── main.jsx
│
├── docs/
├── .github/workflows/
├── .gitignore
├── LICENSE
└── README.md
```

> Note: structure and contents will be filled in during their corresponding phases.

---

## 🚀 Getting Started

> ⚠️ Work in progress — the app is not runnable yet. Installation & run instructions will be added as each phase completes.

### Prerequisites
- Node.js ≥ 20
- npm
- Git
- MongoDB Atlas (or local MongoDB)
- VS Code + Postman / Thunder Client

---

## 🔐 Environment Variables

A `.env.example` file will be provided in each part (server & client).

```env
PORT=5000
MONGODB_URI=
JWT_SECRET=
CLIENT_URL=
```

> ⚠️ NEVER commit real `.env` files. Secrets stay on your machine.

---

## 🌿 Git Workflow

We use a professional branching strategy:

```text
main
 └── develop
      └── feature/<feature-name>
```

Flow per feature: `checkout develop → pull → create feature branch → code → test → commit → push → Pull Request → merge into develop`.

---

## 📚 API Documentation

Will be maintained here as endpoints are implemented.

---

## 🧠 What's Next

1. **Phase 2** — Backend initialization (Express server + `GET /api/health`)
2. **Phase 3** — Frontend initialization (React + Vite + Tailwind)
3. **Frontend ↔ Backend connection**

---

## ⚖️ License

[MIT](LICENSE)