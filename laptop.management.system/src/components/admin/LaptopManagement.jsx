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
} from '@chakra-ui/react';
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa';
import axios from 'axios';

const LaptopManagement = () => {
  const [laptops, setLaptops] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedLaptop, setSelectedLaptop] = useState(null);
  const [formData, setFormData] = useState({
    brand: '',
    model: '',
    serialNumber: '',
    purchaseDate: '',
    status: 'available',
    assignedTo: '',
  });
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const fetchLaptops = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/laptops', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setLaptops(response.data);
    } catch (err) {
      toast({
        title: 'Error fetching laptops',
        description: err.response?.data?.message || 'Failed to fetch laptops',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  }, [toast]);

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
    fetchLaptops();
    fetchUsers();
  }, [fetchLaptops, fetchUsers]);

  const handleEdit = (laptop) => {
    setSelectedLaptop(laptop._id);
    setFormData({
      brand: laptop.brand,
      model: laptop.model,
      serialNumber: laptop.serialNumber,
      purchaseDate: laptop.purchaseDate ? laptop.purchaseDate.split('T')[0] : '',
      status: laptop.status,
      assignedTo: laptop.assignedTo || '',
    });
    onOpen();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this laptop?')) {
      try {
        const token = localStorage.getItem('token');
        await axios.delete(`http://localhost:5000/api/laptops/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        toast({
          title: 'Laptop deleted successfully',
          status: 'success',
          duration: 3000,
          isClosable: true,
        });
        fetchLaptops();
      } catch   {
        toast({
          title: 'Error deleting laptop',
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
      const url = selectedLaptop
        ? `http://localhost:5000/api/laptops/${selectedLaptop}`
        : 'http://localhost:5000/api/laptops';
      const method = selectedLaptop ? 'put' : 'post';

      await axios[method](url, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      toast({
        title: `Laptop ${selectedLaptop ? 'updated' : 'added'} successfully`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onClose();
      fetchLaptops();
      setSelectedLaptop(null);
      setFormData({
        brand: '',
        model: '',
        serialNumber: '',
        purchaseDate: '',
        status: 'available',
        assignedTo: '',
      });
    } catch   {
      toast({
        title: `Error ${selectedLaptop ? 'updating' : 'adding'} laptop`,
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'available':
        return 'green';
      case 'assigned':
        return 'blue';
      case 'maintenance':
        return 'orange';
      default:
        return 'gray';
    }
  };

  return (
    <Box p={5}>
      <HStack justify="space-between" mb={6}>
        <Heading>Laptop Management</Heading>
        <Button leftIcon={<FaPlus />} colorScheme="blue" onClick={() => {
          setSelectedLaptop(null);
          setFormData({
            brand: '',
            model: '',
            serialNumber: '',
            purchaseDate: '',
            status: 'available',
            assignedTo: '',
          });
          onOpen();
        }}>
          Add Laptop
        </Button>
      </HStack>

      <Card variant="outline" mb={6}>
        <CardBody>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Brand</Th>
                <Th>Model</Th>
                <Th>Serial Number</Th>
                <Th>Status</Th>
                <Th>Assigned To</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {laptops.map((laptop) => (
                <Tr key={laptop._id}>
                  <Td>{laptop.brand}</Td>
                  <Td>{laptop.model}</Td>
                  <Td>{laptop.serialNumber}</Td>
                  <Td>
                    <Badge colorScheme={getStatusColor(laptop.status)}>
                      {laptop.status}
                    </Badge>
                  </Td>
                  <Td>
                    {laptop.assignedTo ? 
                      users.find(user => user._id === laptop.assignedTo)?.name || 'Unknown User' 
                      : 'None'}
                  </Td>
                  <Td>
                    <HStack spacing={2}>
                      <Button size="sm" leftIcon={<FaEdit />} onClick={() => handleEdit(laptop)}>
                        Edit
                      </Button>
                      <Button 
                        size="sm" 
                        colorScheme="red" 
                        leftIcon={<FaTrash />} 
                        onClick={() => handleDelete(laptop._id)}
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

      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{selectedLaptop ? 'Edit Laptop' : 'Add New Laptop'}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl mb={4}>
              <FormLabel>Brand</FormLabel>
              <Input name="brand" value={formData.brand} onChange={handleChange} />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Model</FormLabel>
              <Input name="model" value={formData.model} onChange={handleChange} />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Serial Number</FormLabel>
              <Input name="serialNumber" value={formData.serialNumber} onChange={handleChange} />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Purchase Date</FormLabel>
              <Input type="date" name="purchaseDate" value={formData.purchaseDate} onChange={handleChange} />
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Status</FormLabel>
              <Select name="status" value={formData.status} onChange={handleChange}>
                <option value="available">Available</option>
                <option value="assigned">Assigned</option>
                <option value="maintenance">Maintenance</option>
              </Select>
            </FormControl>
            <FormControl mb={4}>
              <FormLabel>Assigned To</FormLabel>
              <Select 
                name="assignedTo" 
                value={formData.assignedTo} 
                onChange={handleChange}
                isDisabled={formData.status !== 'assigned'}
              >
                <option value="">None</option>
                {users.map(user => (
                  <option key={user._id} value={user._id}>{user.name}</option>
                ))}
              </Select>
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={handleSubmit}>
              {selectedLaptop ? 'Update' : 'Save'}
            </Button>
            <Button variant="ghost" onClick={onClose}>Cancel</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default LaptopManagement; 