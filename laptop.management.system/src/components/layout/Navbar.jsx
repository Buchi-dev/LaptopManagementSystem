import { Link } from 'react-router-dom';
import {
  Box,
  Flex,
  Text,
  HStack,
  Avatar,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Button,
  useColorModeValue,
  Icon,
} from '@chakra-ui/react';
import { FaUserCircle, FaCog, FaSignOutAlt, FaMoon, FaSun } from 'react-icons/fa';
import { useAuth } from '../../context/useAuth';
import { useColorMode } from '@chakra-ui/react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { colorMode, toggleColorMode } = useColorMode();
  const bgColor = useColorModeValue('white', 'gray.800');
  const borderColor = useColorModeValue('gray.200', 'gray.700');

  return (
    <Box
      bg={bgColor}
      px={4}
      py={2}
      borderBottom="1px"
      borderColor={borderColor}
      position="fixed"
      w="100%"
      zIndex={10}
    >
      <Flex alignItems="center" justifyContent="space-between">
        <Link to="/">
          <Text fontSize="xl" fontWeight="bold">
            Laptop Management System
          </Text>
        </Link>
        <HStack spacing={4}>
          <Button onClick={toggleColorMode} variant="ghost" size="sm">
            <Icon as={colorMode === 'light' ? FaMoon : FaSun} />
          </Button>
          {user ? (
            <Menu>
              <MenuButton>
                <HStack>
                  <Avatar size="sm" name={user.name} />
                  <Text>{user.name}</Text>
                </HStack>
              </MenuButton>
              <MenuList>
                <MenuItem icon={<Icon as={FaUserCircle} />}>
                  Profile
                </MenuItem>
                <Link to="/settings">
                  <MenuItem icon={<Icon as={FaCog} />}>
                    Settings
                  </MenuItem>
                </Link>
                <MenuItem onClick={logout} icon={<Icon as={FaSignOutAlt} />}>
                  Logout
                </MenuItem>
              </MenuList>
            </Menu>
          ) : (
            <HStack>
              <Link to="/login">
                <Button variant="ghost">Login</Button>
              </Link>
              <Link to="/register">
                <Button colorScheme="blue">Register</Button>
              </Link>
            </HStack>
          )}
        </HStack>
      </Flex>
    </Box>
  );
};

export default Navbar; 