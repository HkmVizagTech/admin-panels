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
} from '@chakra-ui/react';
import Layout from '../components/Layout';
import { useNavigate } from 'react-router-dom';
import { ArrowBackIcon } from '@chakra-ui/icons';

const AllUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
const Navigate = useNavigate();
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch('https://razor-pay-server-production.up.railway.app/book/users'); // replace with your actual endpoint
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
         <IconButton
            icon={<ArrowBackIcon />}
            onClick={() => Navigate(-1)}
            aria-label="Go back"
            variant="ghost"
            mr={2}
          />
    <Container maxW="full" py={8}>
      <Heading size="lg" mb={4}>📊 Total Users: {users.length}</Heading>

      {loading ? (
        <Spinner size="xl" />
      ) : error ? (
        <Alert status="error" mb={4}>
          <AlertIcon />
          {error}
        </Alert>
      ) : (
        <Box overflowX="auto">
          <Table variant="striped" colorScheme="teal" size="sm">
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
                  <Td>{user.whatsappNumber}</Td>
                  <Td>{user.age || '-'}</Td>
                  <Td>{user.collegeOrWorking || '-'}</Td>
                  <Td>{user.place || '-'}</Td>
                  <Td>{user.selectedBook || '-'}</Td>
                  <Td>{user.interestedInGitaSession ? 'Yes' : 'No'}</Td>
                  <Td>{new Date(user.createdAt).toLocaleDateString()}</Td>
                  <Td>{new Date(user.updatedAt).toLocaleDateString()}</Td>
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
