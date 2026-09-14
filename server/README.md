# Hotel Management System — Backend API

Express REST API for the Hotel Management System.

## Setup

```bash
npm install
npm run dev
```

Server runs at `http://localhost:5000`.

## Health check

```
GET http://localhost:5000/api/health
```

Response:

```json
{
  "success": true,
  "message": "Hotel Management API is running",
  "data": {}
}
```

## Structure

```text
server/src/
├── config/       MongoDB connection & environment config
├── controllers/  Request handlers
├── middleware/   Auth, error handling, validation middleware
├── models/       Mongoose schemas
├── routes/       API endpoint definitions
├── services/     Business logic
├── utils/        Helper functions
├── validators/   Request validation rules
├── app.js        Express app (middleware + routes)
└── server.js     Server entry point
```