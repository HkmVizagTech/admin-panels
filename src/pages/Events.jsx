import React, { useEffect, useState } from 'react';
import {
  Box,
  Heading,
  Text,
  Stack,
  Spinner,
  Alert,
  AlertIcon,
  Container,
  Link as ChakraLink,
  IconButton,
} from '@chakra-ui/react';
import Layout from "../components/Layout";
import { Link, useNavigate } from 'react-router-dom';
import { ArrowBackIcon } from '@chakra-ui/icons';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const Navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch("https://folk-server-production.up.railway.app/api/whatsapp/events");
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Error fetching events");
        setEvents(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvents();
  }, []);

  if (loading) return <Spinner size="xl" thickness="4px" color="teal.400" speed="0.65s" />;

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
            onClick={() => Navigate('/')}
            aria-label="Go back"
            variant="ghost"
            mr={2}
          />
    <Container maxW="container.lg" py={8}>
      <Heading textAlign="center" mb={6}>
        📅 Upcoming Gita Events
      </Heading>
      {events.length === 0 ? (
        <Text>No events registered yet.</Text>
      ) : (
        <Stack spacing={6}>
          {events.map((event) => (
             <Link to={`/event/${event._id}`}>
            <Box key={event._id} borderWidth="1px" borderRadius="lg" p={5} boxShadow="md">
              <Heading fontSize="xl" mb={2}>{event.title}</Heading>
              <Text color="gray.600" mb={1}>
                🗓️ Date: {new Date(event.eventDate).toLocaleDateString()}
              </Text>
              <Text color="gray.600" mb={2}>
                🔗 Link: <ChakraLink color="blue.500" href={event.link} isExternal>{event.link}</ChakraLink>
              </Text>
              <Text color="gray.500">We look forward to your participation! 🌸</Text>
            </Box>
            </Link>
          ))}
        </Stack>
      )}
    </Container>
    {/* </Link> */}
    </Layout>
  );
};

export default Events;
