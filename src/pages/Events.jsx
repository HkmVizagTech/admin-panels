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
  useBreakpointValue,
} from '@chakra-ui/react';
import Layout from "../components/Layout";
import { Link, useNavigate } from 'react-router-dom';
import { ArrowBackIcon } from '@chakra-ui/icons';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const res = await fetch("https://razor-pay-server-production.up.railway.app/book/events");
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

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minH="60vh">
        <Spinner size="xl" thickness="4px" color="teal.400" speed="0.65s" />
      </Box>
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
      <Container maxW="container.lg" py={8} px={{ base: 4, md: 6 }}>
        <IconButton
          icon={<ArrowBackIcon />}
          onClick={() => navigate('/')}
          aria-label="Go back"
          variant="ghost"
          mb={4}
        />

        <Heading fontSize={{ base: "2xl", md: "3xl" }} textAlign="center" mb={6}>
          📅 Upcoming Gita Events
        </Heading>

        {events.length === 0 ? (
          <Text textAlign="center" fontSize="md" color="gray.600">
            No events registered yet.
          </Text>
        ) : (
          <Stack spacing={6}>
            {events.map((event) => (
              <Box
                as={Link}
                to={`/event/${event._id}`}
                key={event._id}
                borderWidth="1px"
                borderRadius="lg"
                p={{ base: 4, md: 5 }}
                boxShadow="md"
                _hover={{ boxShadow: "lg", textDecoration: "none" }}
                transition="all 0.2s"
              >
                <Heading fontSize={{ base: "lg", md: "xl" }} mb={2}>
                  {event.title}
                </Heading>

                <Text fontSize={{ base: "sm", md: "md" }} color="gray.600" mb={1}>
                  🗓️ Date: {new Date(event.eventDate).toLocaleDateString()}
                </Text>

                <Text fontSize={{ base: "sm", md: "md" }} color="gray.600" mb={2}>
                  🔗 Link:{' '}
                  <ChakraLink color="blue.500" href={event.link} isExternal wordBreak="break-word">
                    {event.link}
                  </ChakraLink>
                </Text>

                <Text fontSize="sm" color="gray.500">
                  We look forward to your participation! 🌸
                </Text>
              </Box>
            ))}
          </Stack>
        )}
      </Container>
    </Layout>
  );
};

export default Events;
