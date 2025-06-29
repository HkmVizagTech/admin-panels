import React, { useEffect, useState } from 'react';
import {
  Box,
  Container,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Spinner,
  Alert,
  AlertIcon,
  Text,
  IconButton,
  Flex,
  useBreakpointValue,
} from '@chakra-ui/react';
import Layout from '../components/Layout';
import { useNavigate } from 'react-router-dom';
import { ArrowBackIcon } from '@chakra-ui/icons';

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const isMobile = useBreakpointValue({ base: true, md: false });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch('https://razor-pay-server-389286764509.asia-south1.run.app/book/users');
        const data = await res.json();
        if (!Array.isArray(data)) {
          throw new Error('Unexpected response format');
        }
        setUsers(data);
      } catch (err) {
        setError(err.message || 'Failed to fetch users');
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return (
    <Layout>
      <Container maxW="full" px={{ base: 4, md: 8 }} py={8}>
        <Flex justify="space-between" align="center" mb={4}>
          <IconButton
            icon={<ArrowBackIcon />}
            onClick={() => navigate(-1)}
            aria-label="Go back"
            variant="ghost"
            size="md"
          />
          <Heading
            size={{ base: "md", md: "lg" }}
            textAlign={{ base: "center", md: "left" }}
            flex="1"
          >
            📊 Total Users: {users.length}
          </Heading>
        </Flex>

        {loading ? (
          <Box textAlign="center" py={10}>
            <Spinner size="xl" />
            <Text mt={4}>Loading users...</Text>
          </Box>
        ) : error ? (
          <Alert status="error" mb={4}>
            <AlertIcon />
            {error}
          </Alert>
        ) : (
          <Box overflowX="auto" borderRadius="md" boxShadow="sm">
            <Table
              variant="striped"
              colorScheme="teal"
              size="sm"
              minW="900px"
              sx={{
                th: {
                  position: 'sticky',
                  top: 0,
                  bg: 'gray.100',
                  zIndex: 1,
                },
              }}
            >
              <Thead>
                <Tr>
                  <Th>#</Th>
                  <Th>Name</Th>
                  <Th>WhatsApp</Th>
                  <Th>Age</Th>
                  <Th>College/Working</Th>
                  <Th>Place</Th>
                  <Th>Book</Th>
                  <Th>Interested</Th>
                  <Th>Created</Th>
                  <Th>Updated</Th>
                </Tr>
              </Thead>
              <Tbody>
                {users.map((user, index) => (
                  <Tr key={user._id}>
                    <Td>{index + 1}</Td>
                    <Td>{user.name || '-'}</Td>
                    <Td>{user.whatsappNumber || '-'}</Td>
                    <Td>{user.age || '-'}</Td>
                    <Td>{user.collegeOrWorking || '-'}</Td>
                    <Td>{user.place || '-'}</Td>
                    <Td>{user.selectedBook || '-'}</Td>
                    <Td>{user.interestedInGitaSession ? 'Yes' : 'No'}</Td>
                    <Td whiteSpace="nowrap">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </Td>
                    <Td whiteSpace="nowrap">
                      {new Date(user.updatedAt).toLocaleDateString()}
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </Box>
        )}
      </Container>
    </Layout>
  );
};

export default AllUsers;
