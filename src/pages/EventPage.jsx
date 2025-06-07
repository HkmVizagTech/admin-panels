import React, { useEffect, useState } from 'react';
import {
  Box,
  Heading,
  Text,
  Spinner,
  Alert,
  AlertIcon,
  Container,
  Link as ChakraLink,
  Button,
  useToast,
  HStack,
  IconButton,
  Flex,
} from '@chakra-ui/react';
import Layout from "../components/Layout";
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowBackIcon } from '@chakra-ui/icons';

const EventDetail = () => {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const res = await fetch(`https://razor-pay-server-production.up.railway.app/book/event/${id}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Error fetching event");
        setEvent(data.event);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchEvent();
  }, [id]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this event?")) return;

    try {
      const res = await fetch(`https://razor-pay-server-production.up.railway.app/book/event/${id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to delete event");

      toast({
        title: "Event deleted.",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      navigate("/events");
    } catch (err) {
      toast({
        title: "Error deleting event.",
        description: err.message,
        status: "error",
        duration: 4000,
        isClosable: true,
      });
    }
  };

  const handleUpdate = () => {
    navigate(`/event/edit/${id}`);
  };

  if (loading) {
    return (
      <Flex justify="center" align="center" minH="60vh" py={4}>
        <Spinner size="xl" thickness="4px" color="teal.400" speed="0.65s" />
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

  if (!event) return <Text>No event found.</Text>;

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
        <Box
          borderWidth="1px"
          borderRadius="lg"
          p={{ base: 4, md: 6 }}
          boxShadow="md"
        >
          <Heading fontSize={{ base: "xl", md: "2xl" }} mb={4}>
            {event.title}
          </Heading>

          <Text fontSize={{ base: "sm", md: "md" }} color="gray.600" mb={2}>
            🗓️ Date: {new Date(event.eventDate).toLocaleDateString()}
          </Text>

          <Text fontSize={{ base: "sm", md: "md" }} color="gray.600" mb={4}>
            🔗 Link:{" "}
            <ChakraLink color="blue.500" href={event.link} isExternal wordBreak="break-all">
              {event.link}
            </ChakraLink>
          </Text>

          <Text fontSize={{ base: "sm", md: "md" }} color="gray.700" mb={6}>
            {event.description || "No description provided."}
          </Text>

          <HStack spacing={4} flexWrap="wrap">
            <Button colorScheme="teal" onClick={handleUpdate}>
              Update
            </Button>
            <Button colorScheme="red" onClick={handleDelete}>
              Delete
            </Button>
          </HStack>
        </Box>
      </Container>
    </Layout>
  );
};

export default EventDetail;
