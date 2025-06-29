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
  Badge,
  Text,
  useBreakpointValue,
} from '@chakra-ui/react';
import Layout from '../components/Layout';

const AllPayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const isMobile = useBreakpointValue({ base: true, md: false });

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await fetch('https://razor-pay-server-389286764509.asia-south1.run.app/users');
        const data = await res.json();

        if (!Array.isArray(data)) {
          throw new Error('Unexpected response format');
        }

        setPayments(data);
      } catch (err) {
        setError(err.message || 'Failed to fetch payments');
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
  }, []);

  return (
    <Layout>
      <Container maxW="full" px={{ base: 4, md: 8 }} py={{ base: 6, md: 10 }}>
        <Heading
          size={{ base: "md", md: "lg" }}
          mb={6}
          textAlign={{ base: "center", md: "left" }}
        >
          💳 Total Payments: {payments.length}
        </Heading>

        {loading ? (
          <Box textAlign="center" py={10}>
            <Spinner size="xl" />
            <Text mt={4}>Loading payments...</Text>
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
              minW="1000px"
              sx={{
                th: {
                  position: "sticky",
                  top: 0,
                  bg: "gray.100",
                  zIndex: 1,
                },
              }}
            >
              <Thead>
                <Tr>
                  <Th>#</Th>
                  <Th>Name</Th>
                  <Th>Email</Th>
                  <Th>WhatsApp</Th>
                  <Th>Area</Th>
                  <Th>College</Th>
                  <Th>Gender</Th>
                  <Th>Scholar Type</Th>
                  <Th>Amount</Th>
                  <Th>Payment ID</Th>
                  <Th>Status</Th>
                  <Th>Created At</Th>
                </Tr>
              </Thead>
              <Tbody>
                {payments.map((p, index) => (
                  <Tr key={p._id}>
                    <Td>{index + 1}</Td>
                    <Td>{p.name || '-'}</Td>
                    <Td maxW="200px" isTruncated>{p.email || '-'}</Td>
                    <Td>{p.whatsappNumber || '-'}</Td>
                    <Td>{p.area || '-'}</Td>
                    <Td>{p.collegeName || '-'}</Td>
                    <Td>{p.gender || '-'}</Td>
                    <Td>{p.dayScholarOrHostler || '-'}</Td>
                    <Td>₹{p.amount || 0}</Td>
                    <Td maxW="200px" isTruncated>{p.razorpay_payment_id || '-'}</Td>
                    <Td>
                      <Badge colorScheme={p.paymentSuccess ? 'green' : 'red'}>
                        {p.paymentSuccess ? 'Success' : 'Failed'}
                      </Badge>
                    </Td>
                    <Td whiteSpace="nowrap">{new Date(p.createdAt).toLocaleString()}</Td>
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

export default AllPayments;
