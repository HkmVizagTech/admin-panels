// src/pages/Home.js
import { Box, SimpleGrid, Text, Link as ChakraLink } from "@chakra-ui/react";
import Layout from "../components/Layout";
import { Link } from "react-router-dom";

const Pass_Mangement = () => (
  <Layout>
    <Box
      mt={{ base: 8, md: 10 }}
      px={{ base: 4, md: 8, lg: 16 }}
      textAlign="center"
      maxW="1200px"
      mx="auto"
    >
      <Text
        fontSize={{ base: "2xl", sm: "3xl", md: "4xl" }}
        fontWeight="bold"
        mb={{ base: 6, md: 10 }}
      >
        Book Distribution Management
      </Text>

      <SimpleGrid
        columns={{ base: 1, sm: 2, md: 3 }}
        spacing={{ base: 4, sm: 6, md: 8 }}
        px={{ base: 0, sm: 4, md: 0 }}
      >
        <NavCard to="/pass-creation" label="Add Event" />
        {/* <NavCard to="/event-list" label="Get Event" /> */}
        <NavCard to="/pass-dash" label="Get Users" />
        {/* <NavCard to="/addBook" label="Add Book" /> */}
        <NavCard to="/pass" label="Get All Events" />
      </SimpleGrid>
    </Box>
  </Layout>
);

const NavCard = ({ to, label }) => (
  <ChakraLink
    as={Link}
    to={to}
    p={{ base: 6, md: 8 }}
    bg="gray.100"
    borderRadius="lg"
    boxShadow="md"
    _hover={{
      bg: "blue.100",
      textDecoration: "none",
      transform: "scale(1.05)",
      boxShadow: "lg",
    }}
    transition="all 0.2s ease-in-out"
    textAlign="center"
    fontWeight="medium"
    fontSize={{ base: "lg", md: "xl" }}
  >
    {label}
  </ChakraLink>
);

export default Pass_Mangement;
