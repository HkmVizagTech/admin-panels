// src/pages/Profile.js
import {
  Box,
  Text,
  Link as ChakraLink,
  IconButton,
  Flex,
  VStack,
} from "@chakra-ui/react";
import { ArrowBackIcon } from "@chakra-ui/icons";
import { Link, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";

const Profile = () => {
  const navigate = useNavigate();

  return (
    <Layout>
      <Box
        mt={{ base: 6, md: 8 }}
        px={{ base: 4, md: 8, lg: 16 }}
        maxW="800px"
        mx="auto"
      >
        <Flex align="center" mb={{ base: 4, md: 6 }}>
          <IconButton
            icon={<ArrowBackIcon />}
            onClick={() => navigate(-1)}
            aria-label="Go back"
            size={{ base: "sm", md: "md" }}
            variant="ghost"
            mr={3}
          />
          <Text fontSize={{ base: "xl", md: "2xl" }} fontWeight="bold">
            Profile Page
          </Text>
        </Flex>

        <VStack spacing={{ base: 4, md: 6 }} align="stretch" mt={{ base: 4, md: 6 }}>
          <NavLink to="/payments" label="Payments" />
          <NavLink to="/GitaEvent" label="Gita Event Management" />
        </VStack>
      </Box>
    </Layout>
  );
};

const NavLink = ({ to, label }) => (
  <ChakraLink
    as={Link}
    to={to}
    py={{ base: 3, md: 4 }}
    px={{ base: 4, md: 6 }}
    fontSize={{ base: "md", md: "lg" }}
    bg="gray.100"
    borderRadius="md"
    boxShadow="sm"
    _hover={{
      bg: "teal.100",
      textDecoration: "none",
      transform: "scale(1.03)",
      boxShadow: "md",
    }}
    transition="all 0.2s ease-in-out"
    fontWeight="medium"
    textAlign="center"
  >
    {label}
  </ChakraLink>
);

export default Profile;
