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
import { FaLaptop } from 'react-icons/fa';
import axios from 'axios';

const BorrowLaptop = () => {
  const [laptops, setLaptops] = useState([]);
  const [selectedLaptop, setSelectedLaptop] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const toast = useToast();

  const fetchAvailableLaptops = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/laptops/available', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setLaptops(response.data);
    } catch (err) {
      toast({
        title: 'Error fetching laptops',
        description: err.response?.data?.message || 'Failed to fetch available laptops',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  }, [toast, setLaptops]);

  useEffect(() => {
    fetchAvailableLaptops();
  }, [fetchAvailableLaptops]);

  const handleBorrow = async (laptop) => {
    setSelectedLaptop(laptop);
    onOpen();
  };

  const confirmBorrow = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        `http://localhost:5000/api/laptops/${selectedLaptop._id}/borrow`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast({
        title: 'Laptop borrowed successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      onClose();
      fetchAvailableLaptops();
    } catch (err) {
      toast({
        title: 'Error borrowing laptop',
        description: err.response?.data?.message || 'Failed to borrow laptop',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box p={5}>
      <Heading mb={6}>Available Laptops</Heading>

      <Card variant="outline" mb={6}>
        <CardBody>
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Brand</Th>
                <Th>Model</Th>
                <Th>Serial Number</Th>
                <Th>Purchase Date</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {laptops.map((laptop) => (
                <Tr key={laptop._id}>
                  <Td>{laptop.brand}</Td>
                  <Td>{laptop.model}</Td>
                  <Td>{laptop.serialNumber}</Td>
                  <Td>{new Date(laptop.purchaseDate).toLocaleDateString()}</Td>
                  <Td>
                    <Button
                      leftIcon={<FaLaptop />}
                      colorScheme="blue"
                      size="sm"
                      onClick={() => handleBorrow(laptop)}
                    >
                      Borrow
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
          <ModalHeader>Confirm Borrow</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>
              Are you sure you want to borrow this laptop?
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
            <Button colorScheme="blue" onClick={confirmBorrow}>
              Confirm Borrow
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
};

export default BorrowLaptop; 