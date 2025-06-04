// "use client";

import React, { useState } from "react";
import {
  Box,
  Button,
  Checkbox,
  Container,
  FormControl,
  FormLabel,
  Heading,
  Input,
  Stack,
  Text,
  useColorModeValue,
  Link,
  Divider,
  ChakraProvider,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const navigate =useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Login attempt:", { username, password, rememberMe });
    alert("Login attempt: " + JSON.stringify({ username, password, rememberMe }));
     const res = await fetch("https://razor-pay-server-production.up.railway.app/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });

    const data = await res.json();
    if (data.token) {
      sessionStorage.setItem("authToken", data.token);
      navigate("/");
    } else {
      alert("Login failed");
    }
    // Handle login logic here
  };

  return (
    // <ChakraProvider>
      <Container maxW="lg" py={{ base: "12", md: "24" }} px={{ base: "0", sm: "8" }}>
        <Stack spacing="8">
          <Stack spacing="6">
            <Stack spacing={{ base: "2", md: "3" }} textAlign="center">
              <Heading size={{ base: "xs", md: "sm" }}>Login Book Distribution</Heading>
              <Text color="muted">Enter your credentials to access your account</Text>
            </Stack>
          </Stack>
          <Box
            py={{ base: "0", sm: "8" }}
            px={{ base: "4", sm: "10" }}
            bg={useColorModeValue("white", "gray.700")}
            boxShadow={{ base: "none", sm: "md" }}
            borderRadius={{ base: "none", sm: "xl" }}
          >
            <Stack spacing="6">
              <form onSubmit={handleSubmit}>
                <Stack spacing="5">
                  <FormControl>
                    <FormLabel htmlFor="email">UserName</FormLabel>
                    <Input
                      id="email"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Enter your username"
                      required
                    />
                  </FormControl>
                  <FormControl>
                    <FormLabel htmlFor="password">Password</FormLabel>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      required
                    />
                  </FormControl>
                </Stack>
                <Stack spacing="6" mt="6">
                  <Stack direction="row" align="center" justify="space-between">
                    <Checkbox isChecked={rememberMe} onChange={(e) => setRememberMe(e.target.checked)}>
                      Remember me
                    </Checkbox>
                    {/* <Link color="blue.500" fontSize="sm">
                      Forgot password?
                    </Link> */}
                  </Stack>
                  <Button type="submit" colorScheme="blue" size="lg" fontSize="md">
                    Sign in
                  </Button>
                </Stack>
              </form>
              <Divider />
              <Stack spacing="6">
                <Text fontSize="sm" color="muted" textAlign="center">
                  {/* Don't have an account? <Link color="blue.500">Sign up</Link> */}
                </Text>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </Container>
    // </ChakraProvider>
  );
}
