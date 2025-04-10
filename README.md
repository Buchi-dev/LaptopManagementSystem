# Laptop Management System

A full-stack web application for managing laptop inventory, user assignments, and maintenance requests. Built with React, Node.js, Express, and MongoDB.

## Features

### User Features
- User authentication (login/register)
- Dashboard with laptop statistics
- View and manage assigned laptops
- Borrow available laptops
- Request maintenance for laptops
- Dark mode support
- User profile settings

### Admin Features
- Admin dashboard with system statistics
- Manage laptop inventory (CRUD operations)
- Manage users and their roles
- Handle maintenance requests
- View system-wide statistics
- Dark mode support

## Tech Stack

### Frontend
- React.js
- React Router for navigation
- Chakra UI for components and styling
- Axios for API calls
- Context API for state management

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT for authentication
- RESTful API architecture

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Buchi-dev/LaptopManagementSystem.git
cd LaptopManagementSystem
```

2. Install dependencies:
```bash
# Install server dependencies
cd server
npm install

# Install client dependencies
cd ../client
npm install
```

3. Set up environment variables:
Create a `.env` file in the server directory:
```env
MONGODB_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
PORT=5000
```

4. Start the development servers:
```bash
# Start the backend server
cd server
npm run dev

# Start the frontend development server
cd ../client
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend: http://localhost:5000

## API Endpoints

### Authentication
- `POST /api/register` - Register a new user
- `POST /api/login` - Login user
- `GET /api/auth/verify` - Verify authentication token

### Users
- `GET /api/users` - Get all users (admin only)
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Laptops
- `GET /api/laptops` - Get all laptops
- `GET /api/laptops/available` - Get available laptops
- `GET /api/laptops/maintenance` - Get laptops under maintenance
- `POST /api/laptops` - Create new laptop (admin only)
- `PUT /api/laptops/:id` - Update laptop (admin only)
- `DELETE /api/laptops/:id` - Delete laptop (admin only)
- `POST /api/laptops/:id/borrow` - Borrow a laptop
- `POST /api/laptops/:id/return` - Return a laptop
- `POST /api/laptops/:id/maintenance` - Request maintenance

## Project Structure

```
laptop.management.system/
├── src/
│   ├── components/
│   │   ├── admin/
│   │   ├── auth/
│   │   ├── layout/
│   │   └── user/
│   ├── context/
│   ├── theme.js
│   └── App.jsx
├── server/
│   ├── models/
│   ├── routes/
│   └── server.js
└── README.md
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgments

- Chakra UI for the component library
- React team for the amazing framework
- MongoDB for the database solution
