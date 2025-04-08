import React, { useState, useEffect, useCallback } from 'react';
import {
  Box,
  Button,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  HStack,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  FormControl,
  FormLabel,
  Input,
  Select,
  useDisclosure,
  useToast,
  Card,
  CardBody,
  Text,
} from '@chakra-ui/react';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import axios from 'axios';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'user',
  });
  const [isNewUser, setIsNewUser] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const fetchUsers = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/users', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUsers(response.data);
    } catch (err) {
      toast({
        title: 'Error fetching users',
        description: err.response?.data?.message || 'Failed to fetch users',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  }, [toast]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handleAddNew = () => {
    setIsNewUser(true);
    setSelectedUser(null);
    setFormData({
      name: '',
      email: '',
      password: '',
      role: 'user',
    });
    onOpen();
  };

  const handleEdit = (user) => {
    setIsNewUser(false);
    setSelectedUser(user._id);
    setFormData({
      name: user.name,
      email: user.email,
      password: '',
      role: user.role,
    });
    onOpen();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5000/api/users/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        toast({
          title: 'User deleted successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        fetchUsers();
      } catch (error) {
        toast({
          title: 'Error deleting user',
          description: error.response?.data?.message || 'Failed to delete user',
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      }
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      
      if (isNewUser) {
        // Create new user
        await axios.post(
          'http://localhost:5000/api/users',
          formData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        
        toast({
          title: 'User created successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      } else {
        // Update existing user
        const dataToUpdate = { ...formData };
        if (!dataToUpdate.password) {
          delete dataToUpdate.password;
        }
        
        await axios.put(
          `http://localhost:5000/api/users/${selectedUser}`,
          dataToUpdate,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        toast({
          title: 'User updated successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
      }
      
      onClose();
      fetchUsers();
      setSelectedUser(null);
      setFormData({
        name: '',
        email: '',
        password: '',
        role: 'user',
      });
    } catch (error) {
      toast({
        title: isNewUser ? 'Error creating user' : 'Error updating user',
        description: error.response?.data?.message || `Failed to ${isNewUser ? 'create' : 'update'} user`,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const getRoleColor = (role) => {
    switch (role) {
      case 'admin':
        return 'purple';
      case 'user':
        return 'blue';
      default:
        return 'gray';
    }
  };

  return (
    <Box p={5}>
      <HStack justifyContent="space-between" mb={6}>
        <Heading>User Management</Heading>
        <Button 
          leftIcon={<FaPlus />} 
          colorScheme="green" 
          onClick={handleAddNew}
        >
          Add User
        </Button>
      </HStack>

      <Card variant="outline" mb={6}>
        <CardBody>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>Email</Th>
                <Th>Role</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {users.map((user) => (
                <Tr key={user._id}>
                  <Td>{user.name}</Td>
                  <Td>{user.email}</Td>
                  <Td>
                    <Badge colorScheme={getRoleColor(user.role)}>
                      {user.role}
                    </Badge>
                  </Td>
                  <Td>
                    <HStack spacing={2}>
                      <Button
                        leftIcon={<FaEdit />}
                        colorScheme="blue"
                        size="sm"
                        onClick={() => handleEdit(user)}
                      >
                        Edit
                      </Button>
                      <Button
                        leftIcon={<FaTrash />}
                        colorScheme="red"
                        size="sm"
                        onClick={() => handleDelete(user._id)}
                      >
                        Delete
                      </Button>
                    </HStack>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </CardBody>
      </Card>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{isNewUser ? 'Add User' : 'Edit User'}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <form onSubmit={handleSubmit}>
              <FormControl mb={4}>
                <FormLabel>Name</FormLabel>
                <Input
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </FormControl>
              <FormControl mb={4}>
                <FormLabel>Email</FormLabel>
                <Input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </FormControl>
              <FormControl mb={4}>
                <FormLabel>Password {!isNewUser && '(leave blank to keep current)'}</FormLabel>
                <Input
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  required={isNewUser}
                />
              </FormControl>
              <FormControl mb={4}>
                <FormLabel>Role</FormLabel>
                <Select
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  required
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </Select>
              </FormControl>
            </form>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="blue" onClick={handleSubmit}>
              {isNewUser ? 'Create User' : 'Save Changes'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default UserManagement; 