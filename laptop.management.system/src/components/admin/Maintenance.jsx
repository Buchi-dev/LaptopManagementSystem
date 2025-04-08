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
import { FaTools, FaCheck } from 'react-icons/fa';
import axios from 'axios';

const Maintenance = () => {
  const [laptops, setLaptops] = useState([]);
  const [selectedLaptop, setSelectedLaptop] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const fetchMaintenanceLaptops = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/laptops/maintenance', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setLaptops(response.data);
    } catch (err) {
      toast({
        title: 'Error fetching maintenance laptops',
        description: err.response?.data?.message || 'Failed to fetch laptops under maintenance',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  }, [toast, setLaptops]);

  useEffect(() => {
    fetchMaintenanceLaptops();
  }, [fetchMaintenanceLaptops]);

  const handleComplete = (laptop) => {
    setSelectedLaptop(laptop);
    onOpen();
  };

  const confirmComplete = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:5000/api/laptops/${selectedLaptop._id}`,
        { status: 'available' },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast({
        title: 'Maintenance completed successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onClose();
      fetchMaintenanceLaptops();
    } catch (err) {
      toast({
        title: 'Error completing maintenance',
        description: err.response?.data?.message || 'Failed to complete maintenance',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box p={5}>
      <Heading mb={6}>Maintenance Management</Heading>

      <Card variant="outline" mb={6}>
        <CardBody>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Brand</Th>
                <Th>Model</Th>
                <Th>Serial Number</Th>
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
                  <Td>{laptop.assignedTo?.name || 'Not assigned'}</Td>
                  <Td>
                    <Button
                      leftIcon={<FaCheck />}
                      colorScheme="green"
                      size="sm"
                      onClick={() => handleComplete(laptop)}
                    >
                      Complete Maintenance
                    </Button>
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
          <ModalHeader>Complete Maintenance</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>
              Are you sure you want to mark this laptop as available?
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
            <Button colorScheme="green" onClick={confirmComplete}>
              Complete Maintenance
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default Maintenance; 