import { Link, useLocation } from 'react-router-dom';
import {
  Box,
  VStack,
  HStack,
  Icon,
  Text,
  useColorModeValue,
} from '@chakra-ui/react';
import { FaLaptop, FaUsers, FaCog, FaSignOutAlt, FaHandHolding, FaHome, FaTools } from 'react-icons/fa';
import { useAuth } from '../../context/useAuth';

const Sidebar = () => {
  const location = useLocation();
  const { user, logout } = useAuth();
  const bgColor = useColorModeValue('white', 'gray.800');
  const hoverBgColor = useColorModeValue('gray.100', 'gray.700');
  const activeBgColor = useColorModeValue('blue.50', 'blue.900');
  const activeTextColor = useColorModeValue('blue.600', 'blue.300');

  const userMenuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: FaHome },
    { path: '/my-laptops', label: 'My Laptops', icon: FaLaptop },
    { path: '/borrow-laptop', label: 'Borrow Laptop', icon: FaHandHolding },
  ];

  const adminMenuItems = [
    { path: '/admin', label: 'Dashboard', icon: FaHome },
    { path: '/admin/laptops', label: 'Manage Laptops', icon: FaLaptop },
    { path: '/admin/users', label: 'Manage Users', icon: FaUsers },
    { path: '/admin/maintenance', label: 'Maintenance', icon: FaTools },
  ];

  const commonMenuItems = [
    { path: '/settings', label: 'Settings', icon: FaCog },
  ];

  const menuItems = user?.role === 'admin' 
    ? [...adminMenuItems, ...commonMenuItems]
    : [...userMenuItems, ...commonMenuItems];

  return (
    <Box
      w="250px"
      h="calc(100vh - 70px)"
      bg={bgColor}
      borderRight="1px"
      borderColor={useColorModeValue('gray.200', 'gray.700')}
      position="fixed"
      left={0}
      top="70px"
      p={4}
    >
      <VStack spacing={4} align="stretch">
        <Text fontSize="2xl" fontWeight="bold" mb={8}>
          LMS
        </Text>
        {menuItems.map((item) => (
          <Link key={item.path} to={item.path}>
            <HStack
              p={3}
              borderRadius="md"
              _hover={{ bg: hoverBgColor }}
              bg={location.pathname === item.path ? activeBgColor : 'transparent'}
              color={location.pathname === item.path ? activeTextColor : 'inherit'}
            >
              <Icon as={item.icon} />
              <Text>{item.label}</Text>
            </HStack>
          </Link>
        ))}
        <HStack
          p={3}
          borderRadius="md"
          _hover={{ bg: hoverBgColor }}
          cursor="pointer"
          onClick={logout}
        >
          <Icon as={FaSignOutAlt} />
          <Text>Logout</Text>
        </HStack>
      </VStack>
    </Box>
  );
};

export default Sidebar; 