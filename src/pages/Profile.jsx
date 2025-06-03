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
      <Box mt="6" px={4}>
        <Flex align="center" mb={4}>
          <IconButton
            icon={<ArrowBackIcon />}
            onClick={() => navigate(-1)}
            aria-label="Go back"
            size="sm"
            variant="ghost"
            mr={2}
          />
          <Text fontSize="2xl" fontWeight="bold">
            Profile Page
          </Text>
        </Flex>

        <VStack spacing={3} align="stretch" mt={4}>
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
    py={2}
    px={3}
    fontSize="sm"
    bg="gray.100"
    borderRadius="md"
    boxShadow="sm"
    _hover={{
      bg: "teal.100",
      textDecoration: "none",
      transform: "scale(1.02)",
    }}
    transition="all 0.2s ease-in-out"
    fontWeight="medium"
  >
    {label}
  </ChakraLink>
);

export default Profile;
