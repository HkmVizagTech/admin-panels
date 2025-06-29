import React, { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Container,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Heading,
  Spinner,
  Alert,
  AlertIcon,
  useToast,
  IconButton,
  VStack,
  Flex,
} from '@chakra-ui/react';
import { useParams, useNavigate } from 'react-router-dom';
import Layout from '../components/Layout';
import { ArrowBackIcon } from '@chakra-ui/icons';

const EditEvent = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const toast = useToast();

  const [formData, setFormData] = useState({
    title: '',
    eventDate: '',
    link: '',
    description: '',
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await fetch(`https://razor-pay-server-389286764509.asia-south1.run.app/book/event/${id}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to fetch event');
        setFormData({
          title: data.event.title,
          eventDate: new Date(data.event.eventDate).toISOString().slice(0, 16), // ISO for datetime-local
          link: data.event.link,
          description: data.event.description || '',
        });
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch(`https://razor-pay-server-389286764509.asia-south1.run.app/book/event/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to update event');

      toast({
        title: 'Event updated successfully!',
        status: 'success',
        duration: 3000,
        isClosable: true,
      });
      navigate(`/event/${id}`);
    } catch (err) {
      toast({
        title: 'Error updating event',
        description: err.message,
        status: 'error',
        duration: 4000,
        isClosable: true,
      });
    }
  };

  if (loading) {
    return (
      <Flex justify="center" align="center" minH="60vh" py={4}>
        <Spinner size="xl" color="teal.400" />
      </Flex>
    );
  }

  if (error) {
    return (
      <Container maxW="container.md" py={6}>
        <Alert status="error" borderRadius="md">
          <AlertIcon />
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Layout>
      <Container maxW="container.md" py={6} px={{ base: 4, md: 8 }}>
        <IconButton
          icon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          aria-label="Go back"
          variant="ghost"
          mb={4}
        />
        <Box borderWidth="1px" borderRadius="lg" p={{ base: 4, md: 6 }} boxShadow="md">
          <Heading size="lg" mb={6}>✏️ Edit Event</Heading>
          <form onSubmit={handleSubmit}>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Title</FormLabel>
                <Input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                />
              </FormControl>

              <FormControl isRequired>
                <FormLabel>Event Date</FormLabel>
                <Input
                  type="datetime-local"
                  name="eventDate"
                  value={formData.eventDate}
                  onChange={handleChange}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Event Link</FormLabel>
                <Input
                  type="url"
                  name="link"
                  value={formData.link}
                  onChange={handleChange}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Description</FormLabel>
                <Textarea
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Optional description..."
                />
              </FormControl>

              <Button
                colorScheme="teal"
                type="submit"
                width="full"
              >
                Save Changes
              </Button>
            </VStack>
          </form>
        </Box>
      </Container>
    </Layout>
  );
};

export default EditEvent;
