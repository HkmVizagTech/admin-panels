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

  // Fetch current event data
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await fetch(`https://folk-server-b25x.onrender.com/api/whatsapp/event/${id}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || 'Failed to fetch event');
        setFormData({
          title: data.event.title,
          eventDate: new Date(data.event.eventDate).toISOString().substr(0, 10), // for input type="date"
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
      const res = await fetch(`https://folk-server-production.up.railway.app/api/whatsapp/event/${id}`, {
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

  if (loading) return <Spinner size="xl" color="teal.400" />;

  if (error) {
    return (
      <Alert status="error" my={4}>
        <AlertIcon />
        {error}
      </Alert>
    );
  }

  return (
    <Layout>
         <IconButton
            icon={<ArrowBackIcon />}
            onClick={() => navigate(-1)}
            aria-label="Go back"
            variant="ghost"
            mr={2}
          />
      <Container maxW="container.md" py={8}>
        <Box borderWidth="1px" borderRadius="lg" p={6} boxShadow="md">
          <Heading mb={6}>✏️ Edit Event</Heading>
          <form onSubmit={handleSubmit}>
            <FormControl mb={4} isRequired>
              <FormLabel>Title</FormLabel>
              <Input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
              />
            </FormControl>

            <FormControl mb={4} isRequired>
              <FormLabel>Event Date</FormLabel>
              <Input
                type="datetime-local"
                name="eventDate"
                value={formData.eventDate}
                onChange={handleChange}
              />
            </FormControl>

            <FormControl mb={4}>
              <FormLabel>Event Link</FormLabel>
              <Input
                type="url"
                name="link"
                value={formData.link}
                onChange={handleChange}
              />
            </FormControl>
            <Button colorScheme="teal" type="submit">
              Save Changes
            </Button>
          </form>
        </Box>
      </Container>
    </Layout>
  );
};

export default EditEvent;
