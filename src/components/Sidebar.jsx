// src/components/Sidebar.js
import { Box, VStack, Text, Button } from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";

const Sidebar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    sessionStorage.removeItem("authToken"); // Remove token or session data
    navigate("/login"); // Redirect to login page
  };

  return (
    <Box
      width="250px"
      bg="gray.800"
      color="white"
      p="5"
      height="100vh"
      position="sticky"
      top="0"
    >
      <Text fontSize="2xl" fontWeight="bold" mb="6" textAlign="center">
        My Sidebar
      </Text>
      <VStack align="stretch" spacing="4">
        <Box
          as={Link}
          to="/"
          _hover={{ bg: "gray.700" }}
          p="3"
          borderRadius="md"
          cursor="pointer"
        >
         Book-distribution
        </Box>
        <Box
          as={Link}
          to="/profile"
          _hover={{ bg: "gray.700" }}
          p="3"
          borderRadius="md"
          cursor="pointer"
        >
         Gita-spark
        </Box>
    <Box
          as={Link}
          to="/pass-man"
          _hover={{ bg: "gray.700" }}
          p="3"
          borderRadius="md"
          cursor="pointer"
        >
         Pass-Distibution
        </Box>
        {/* Logout Button */}
        <Button
          onClick={handleLogout}
          colorScheme="red"
          size="sm"
          mt="8"
          alignSelf="start"
        >
          Logout
        </Button>
      </VStack>
    </Box>
  );
};

export default Sidebar;
