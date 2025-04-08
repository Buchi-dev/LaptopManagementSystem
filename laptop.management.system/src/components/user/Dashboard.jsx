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
import { FaLaptop, FaTools, FaPlus } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const [totalLaptops, setTotalLaptops] = useState(0);
  const [assignedLaptops, setAssignedLaptops] = useState(0);
  const [maintenanceLaptops, setMaintenanceLaptops] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    const fetchLaptopStats = async () => {
      setIsLoading(true);
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/api/my-laptops', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const laptops = response.data;
        setTotalLaptops(laptops.length);
        setAssignedLaptops(laptops.filter(laptop => laptop.status === 'assigned').length);
        setMaintenanceLaptops(laptops.filter(laptop => laptop.status === 'maintenance').length);
      } catch (error) {
        toast({
          title: 'Error fetching laptop statistics',
          description: error.message,
          status: 'error',
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchLaptopStats();
  }, [toast]);

  if (isLoading) {
    return <Box p={5}>Loading...</Box>;
  }

  return (
    <Box p={5}>
      <Heading mb={6}>Dashboard</Heading>
      
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
                <Text fontSize="sm" color="gray.500">Assigned to you</Text>
              </Stat>
            </CardBody>
          </Card>
          
          <Card>
            <CardBody>
              <Stat>
                <HStack>
                  <Icon as={FaLaptop} color="green.500" boxSize={6} />
                  <StatLabel>Active Laptops</StatLabel>
                </HStack>
                <StatNumber>{assignedLaptops}</StatNumber>
                <Text fontSize="sm" color="gray.500">Currently in use</Text>
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
                <Text fontSize="sm" color="gray.500">Being serviced</Text>
              </Stat>
            </CardBody>
          </Card>
        </Grid>
      </Box>

      <Box mb={6}>
        <Heading size="md" mb={4}>Quick Actions</Heading>
        <HStack spacing={4}>
          <Button leftIcon={<FaTools />} colorScheme="orange" as={Link} to="/my-laptops">
            Request Maintenance
          </Button>
          <Button leftIcon={<FaPlus />} colorScheme="blue" as={Link} to="/my-laptops">
            View All Laptops
          </Button>
        </HStack>
      </Box>
    </Box>
  );
};

export default Dashboard; 