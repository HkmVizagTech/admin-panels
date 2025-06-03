// src/pages/Home.js
import { Box, SimpleGrid, Text, Link as ChakraLink, IconButton } from "@chakra-ui/react";
import Layout from "../components/Layout";
import { Link, Navigate } from "react-router-dom";
import { ArrowBackIcon } from "@chakra-ui/icons";

const Home = () => (
  <Layout>
  
    <Box mt="10" textAlign="center">
      <Text fontSize="3xl" fontWeight="bold" mb="6">
        Book Distribution Management
      </Text>

      <SimpleGrid columns={{ base: 1, sm: 2, md: 3 }} spacing={6} px={4}>
        <NavCard to="/add-event" label="Add Event" />
        <NavCard to="/event-list" label="Get Event" />
        <NavCard to="/users" label="Get Users" />
        <NavCard to="/addBook" label="Add Book" />
        <NavCard to="/getAllBooks" label="Get All Books" />
      </SimpleGrid>
    </Box>
  </Layout>
);

const NavCard = ({ to, label }) => (
  <ChakraLink
    as={Link}
    to={to}
    p={6}
    bg="gray.100"
    borderRadius="lg"
    boxShadow="md"
    _hover={{ bg: "blue.100", textDecoration: "none", transform: "scale(1.02)" }}
    transition="all 0.2s ease-in-out"
    textAlign="center"
    fontWeight="medium"
    fontSize="lg"
  >
    {label}
  </ChakraLink>
);

export default Home;
