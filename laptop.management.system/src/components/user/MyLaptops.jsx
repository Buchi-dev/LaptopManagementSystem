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
  useToast,
  Card,
  CardBody,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Text,
} from '@chakra-ui/react';
import { FaLaptop, FaTools, FaUndo } from 'react-icons/fa';
import axios from 'axios';

const MyLaptops = () => {
  const [laptops, setLaptops] = useState([]);
  const [selectedLaptop, setSelectedLaptop] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const fetchMyLaptops = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/my-laptops', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setLaptops(response.data);
    } catch (err) {
      toast({
        title: 'Error fetching laptops',
        description: err.response?.data?.message || 'Failed to fetch your laptops',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  }, [toast]);

  useEffect(() => {
    fetchMyLaptops();
  }, [fetchMyLaptops]);

  const handleReturn = (laptop) => {
    setSelectedLaptop(laptop);
    onOpen();
  };

  const confirmReturn = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `http://localhost:5000/api/laptops/${selectedLaptop._id}/return`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast({
        title: 'Laptop returned successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onClose();
      fetchMyLaptops();
    } catch (err) {
      toast({
        title: 'Error returning laptop',
        description: err.response?.data?.message || 'Failed to return laptop',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const handleMaintenanceRequest = async (laptopId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `http://localhost:5000/api/laptops/${laptopId}/maintenance`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast({
        title: 'Maintenance request submitted',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      fetchMyLaptops();
    } catch (err) {
      toast({
        title: 'Error submitting maintenance request',
        description: err.response?.data?.message || 'Failed to submit maintenance request',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
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
      <Heading mb={6}>My Laptops</Heading>

      <Card variant="outline" mb={6}>
        <CardBody>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Brand</Th>
                <Th>Model</Th>
                <Th>Serial Number</Th>
                <Th>Status</Th>
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
                    <HStack spacing={2}>
                      {laptop.status === 'assigned' && (
                        <>
                          <Button
                            leftIcon={<FaUndo />}
                            colorScheme="blue"
                            size="sm"
                            onClick={() => handleReturn(laptop)}
                          >
                            Return
                          </Button>
                          <Button
                            leftIcon={<FaTools />}
                            colorScheme="orange"
                            size="sm"
                            onClick={() => handleMaintenanceRequest(laptop._id)}
                          >
                            Request Maintenance
                          </Button>
                        </>
                      )}
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
          <ModalHeader>Confirm Return</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>
              Are you sure you want to return this laptop?
              <br />
              <strong>Brand:</strong> {selectedLaptop?.brand}
              <br />
              <strong>Model:</strong> {selectedLaptop?.model}
              <br />
              <strong>Serial Number:</strong> {selectedLaptop?.serialNumber}
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Cancel
            </Button>
            <Button colorScheme="blue" onClick={confirmReturn}>
              Confirm Return
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default MyLaptops; 