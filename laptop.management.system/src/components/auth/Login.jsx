import { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  Text,
  Link as ChakraLink,
  useToast,
} from '@chakra-ui/react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/useAuth';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box
      maxW="md"
      mx="auto"
      mt="8"
      p="8"
      bg="white"
      borderRadius="lg"
      boxShadow="lg"
    >
      <VStack spacing="6">
        <Heading size="lg">Welcome Back</Heading>
        <Text color="gray.600">Sign in to your account</Text>

        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <VStack spacing="4">
            <FormControl isRequired>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
              />
            </FormControl>

            <FormControl isRequired>
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
              />
            </FormControl>

            <Button
              type="submit"
              colorScheme="brand"
              width="full"
              isLoading={isLoading}
            >
              Sign In
            </Button>
          </VStack>
        </form>

        <Text>
          Don't have an account?{' '}
          <ChakraLink as={RouterLink} to="/register" color="brand.500">
            Sign up
          </ChakraLink>
        </Text>
      </VStack>
    </Box>
  );
};

export default Login; 