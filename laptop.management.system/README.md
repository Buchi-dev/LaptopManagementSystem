# Laptop Management System

A comprehensive system for managing laptop inventory, user assignments, and maintenance requests.

## Features

- User and Admin authentication
- Laptop inventory management
- User management
- Maintenance request system
- Role-based access control
- Modern UI with Chakra UI

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

## Setup

1. Clone the repository
2. Install dependencies for both frontend and backend:

```bash
# Install frontend dependencies
cd laptop.management.system
npm install

# Install backend dependencies
cd ../server
npm install
```

3. Create a `.env` file in the server directory with the following variables:

```
PORT=5000
JWT_SECRET=your-secret-key
MONGODB_URI=mongodb://localhost:27017/laptopManagement
```

4. Start MongoDB locally or use MongoDB Atlas

## Running the Application

1. Start the backend server:

```bash
cd server
npm start
```

2. Start the frontend development server:

```bash
cd laptop.management.system
npm run dev
```

3. Open your browser and navigate to `http://localhost:5173`

## Default Admin Credentials

- Email: admin@example.com
- Password: admin123

## API Endpoints

### Authentication
- POST /api/register - Register a new user
- POST /api/login - Login user

### Laptops
- GET /api/laptops - Get all laptops (admin only)
- POST /api/laptops - Add new laptop (admin only)
- PUT /api/laptops/:id - Update laptop (admin only)
- DELETE /api/laptops/:id - Delete laptop (admin only)
- GET /api/my-laptops - Get user's assigned laptops

### Users
- GET /api/users - Get all users (admin only)
- POST /api/users - Add new user (admin only)
- PUT /api/users/:id - Update user (admin only)
- DELETE /api/users/:id - Delete user (admin only)

## Technologies Used

- Frontend:
  - React
  - Chakra UI
  - React Router
  - Axios

- Backend:
  - Node.js
  - Express
  - MongoDB
  - JWT Authentication

## License

MIT
