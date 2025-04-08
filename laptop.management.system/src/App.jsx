import { Routes, Route, Navigate } from 'react-router-dom';
import { Box, ChakraProvider, useColorModeValue } from '@chakra-ui/react';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/useAuth';
import theme from './theme';

// Layout Components
import Navbar from './components/layout/Navbar';
import Sidebar from './components/layout/Sidebar';

// Auth Components
import Login from './components/auth/Login';
import Register from './components/auth/Register';

// User Components
import Dashboard from './components/user/Dashboard';
import MyLaptops from './components/user/MyLaptops';
import BorrowLaptop from './components/user/BorrowLaptop';

// Admin Components
import AdminDashboard from './components/admin/Dashboard';
import LaptopManagement from './components/admin/LaptopManagement';
import UserManagement from './components/admin/UserManagement';
import Maintenance from './components/admin/Maintenance';

// Settings Component
import Settings from './components/Settings';

// Protected Route Component
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" />;
  }
  
  if (adminOnly && user.role !== 'admin') {
    return <Navigate to="/dashboard" />;
  }
  
  return children;
};

function AppContent() {
  const bgColor = useColorModeValue('gray.50', 'gray.800');
  
  return (
    <Box minH="100vh" bg={bgColor}>
      <Navbar />
      <Box display="flex" pt="70px">
        <Sidebar />
        <Box flex="1" ml="250px" p={6}>
          <Routes>
            {/* Auth Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* User Routes */}
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/my-laptops" element={
              <ProtectedRoute>
                <MyLaptops />
              </ProtectedRoute>
            } />
            <Route path="/borrow-laptop" element={
              <ProtectedRoute>
                <BorrowLaptop />
              </ProtectedRoute>
            } />
            
            {/* Admin Routes */}
            <Route path="/admin" element={
              <ProtectedRoute adminOnly>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/laptops" element={
              <ProtectedRoute adminOnly>
                <LaptopManagement />
              </ProtectedRoute>
            } />
            <Route path="/admin/users" element={
              <ProtectedRoute adminOnly>
                <UserManagement />
              </ProtectedRoute>
            } />
            <Route path="/admin/maintenance" element={
              <ProtectedRoute adminOnly>
                <Maintenance />
              </ProtectedRoute>
            } />
            
            {/* Settings Route */}
            <Route path="/settings" element={
              <ProtectedRoute>
                <Settings />
              </ProtectedRoute>
            } />
            
            {/* Default Route */}
            <Route path="/" element={<Navigate to="/dashboard" />} />
          </Routes>
        </Box>
      </Box>
    </Box>
  );
}

function App() {
  return (
    <ChakraProvider theme={theme}>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </ChakraProvider>
  );
}

export default App;
