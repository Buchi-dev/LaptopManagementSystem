import React, { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  VStack,
  Heading,
  useToast,
  Card,
  CardBody,
  FormHelperText,
  useColorMode,
  Switch,
} from '@chakra-ui/react';
import { useAuth } from '../context/useAuth';
import axios from 'axios';

const Settings = () => {
  const { user, login } = useAuth();
  const toast = useToast();
  const { colorMode, toggleColorMode } = useColorMode();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:5000/api/users/${user._id}`,
        {
          name: formData.name,
          email: formData.email,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // Update the user in the auth context
      const updatedUser = { ...user, name: formData.name, email: formData.email };
      login(updatedUser.email, formData.currentPassword);

      toast({
        title: 'Profile updated successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
    } catch (err) {
      toast({
        title: 'Error updating profile',
        description: err.response?.data?.message || 'Failed to update profile',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (formData.newPassword !== formData.confirmPassword) {
      toast({
        title: 'Error',
        description: 'New passwords do not match',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
      setIsLoading(false);
      return;
    }

    try {
      const token = localStorage.getItem('token');
      await axios.put(
        `http://localhost:5000/api/users/${user._id}`,
        {
          currentPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast({
        title: 'Password updated successfully',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });

      // Clear password fields
      setFormData({
        ...formData,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });
    } catch (err) {
      toast({
        title: 'Error updating password',
        description: err.response?.data?.message || 'Failed to update password',
        status: 'error',
        duration: 3000,
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Box p={5}>
      <Heading mb={6}>Settings</Heading>

      <VStack spacing={6} align="stretch">
        {/* Profile Settings */}
        <Card>
          <CardBody>
            <Heading size="md" mb={4}>Profile Settings</Heading>
            <form onSubmit={handleProfileUpdate}>
              <VStack spacing={4}>
                <FormControl>
                  <FormLabel>Name</FormLabel>
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Your name"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Email</FormLabel>
                  <Input
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Your email"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Current Password</FormLabel>
                  <Input
                    name="currentPassword"
                    type="password"
                    value={formData.currentPassword}
                    onChange={handleChange}
                    placeholder="Enter current password"
                  />
                  <FormHelperText>
                    Required to confirm changes
                  </FormHelperText>
                </FormControl>
                <Button
                  type="submit"
                  colorScheme="blue"
                  isLoading={isLoading}
                  width="full"
                >
                  Update Profile
                </Button>
              </VStack>
            </form>
          </CardBody>
        </Card>

        {/* Password Settings */}
        <Card>
          <CardBody>
            <Heading size="md" mb={4}>Change Password</Heading>
            <form onSubmit={handlePasswordChange}>
              <VStack spacing={4}>
                <FormControl>
                  <FormLabel>New Password</FormLabel>
                  <Input
                    name="newPassword"
                    type="password"
                    value={formData.newPassword}
                    onChange={handleChange}
                    placeholder="Enter new password"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Confirm New Password</FormLabel>
                  <Input
                    name="confirmPassword"
                    type="password"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm new password"
                  />
                </FormControl>
                <Button
                  type="submit"
                  colorScheme="blue"
                  isLoading={isLoading}
                  width="full"
                >
                  Change Password
                </Button>
              </VStack>
            </form>
          </CardBody>
        </Card>

        {/* Appearance Settings */}
        <Card>
          <CardBody>
            <Heading size="md" mb={4}>Appearance</Heading>
            <VStack spacing={4} align="stretch">
              <FormControl display="flex" alignItems="center">
                <FormLabel mb="0">
                  Dark Mode
                </FormLabel>
                <Switch
                  isChecked={colorMode === 'dark'}
                  onChange={toggleColorMode}
                />
              </FormControl>
            </VStack>
          </CardBody>
        </Card>
      </VStack>
    </Box>
  );
};

export default Settings; 