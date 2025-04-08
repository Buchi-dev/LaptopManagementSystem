import React, { useState, useEffect } from 'react';
import {
  Box,
  Grid,
  Card,
  CardHeader,
  CardBody,
  Heading,
  Text,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatGroup,
  useToast,
  Button,
  HStack,
  Icon,
} from '@chakra-ui/react';
import { FaLaptop, FaUsers, FaTools, FaPlus } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import axios from 'axios';

const AdminDashboard = () => {
  const [totalLaptops, setTotalLaptops] = useState(0);
  const [totalUsers, setTotalUsers] = useState(0);
  const [maintenanceLaptops, setMaintenanceLaptops] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        const [laptopsResponse, usersResponse] = await Promise.all([
          axios.get('http://localhost:5000/api/laptops', {
            headers: { Authorization: `Bearer ${token}` }
          }),
          axios.get('http://localhost:5000/api/users', {
            headers: { Authorization: `Bearer ${token}` }
          })
        ]);

        const laptops = laptopsResponse.data;
        setTotalLaptops(laptops.length);
        setMaintenanceLaptops(laptops.filter(laptop => laptop.status === 'maintenance').length);
        setTotalUsers(usersResponse.data.length);
      } catch (error) {
        toast({
          title: 'Error fetching data',
          description: error.message,
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [toast]);

  if (isLoading) {
    return <Box p={5}>Loading...</Box>;
  }

  return (
    <Box p={5}>
      <Heading mb={6}>Admin Dashboard</Heading>
      
      <Box mb={8}>
        <Grid templateColumns="repeat(3, 1fr)" gap={6}>
          <Card>
            <CardBody>
              <Stat>
                <HStack>
                  <Icon as={FaLaptop} color="blue.500" boxSize={6} />
                  <StatLabel>Total Laptops</StatLabel>
                </HStack>
                <StatNumber>{totalLaptops}</StatNumber>
                <Text fontSize="sm" color="gray.500">In inventory</Text>
              </Stat>
            </CardBody>
          </Card>
          
          <Card>
            <CardBody>
              <Stat>
                <HStack>
                  <Icon as={FaUsers} color="green.500" boxSize={6} />
                  <StatLabel>Total Users</StatLabel>
                </HStack>
                <StatNumber>{totalUsers}</StatNumber>
                <Text fontSize="sm" color="gray.500">Registered users</Text>
              </Stat>
            </CardBody>
          </Card>
          
          <Card>
            <CardBody>
              <Stat>
                <HStack>
                  <Icon as={FaTools} color="orange.500" boxSize={6} />
                  <StatLabel>Under Maintenance</StatLabel>
                </HStack>
                <StatNumber>{maintenanceLaptops}</StatNumber>
                <Text fontSize="sm" color="gray.500">Laptops being serviced</Text>
              </Stat>
            </CardBody>
          </Card>
        </Grid>
      </Box>

      <Box mb={6}>
        <Heading size="md" mb={4}>Quick Actions</Heading>
        <HStack spacing={4}>
          <Button leftIcon={<FaLaptop />} colorScheme="blue" as={Link} to="/admin/laptops">
            Manage Laptops
          </Button>
          <Button leftIcon={<FaUsers />} colorScheme="green" as={Link} to="/admin/users">
            Manage Users
          </Button>
          <Button leftIcon={<FaPlus />} colorScheme="purple" as={Link} to="/admin/laptops">
            Add New Laptop
          </Button>
        </HStack>
      </Box>
    </Box>
  );
};

export default AdminDashboard; 