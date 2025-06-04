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
} from '@chakra-ui/react';
import Layout from '../components/Layout';

const AllPayments = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await fetch('https://razor-pay-server-production.up.railway.app/users'); // replace with your endpoint
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
    <Container maxW="full" py={8}>
      <Heading size="lg" mb={4}>💳 Total Payments: {payments.length}</Heading>

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
                <Th>Email</Th>
                <Th>WhatsApp</Th>
                <Th>Area</Th>
                <Th>College</Th>
                <Th>Gender</Th>
                <Th>Day Scholar / Hostler</Th>
                <Th>Amount</Th>
                {/* <Th>Razorpay Order ID</Th> */}
                <Th>Payment ID</Th>
                {/* <Th>Signature</Th> */}
                <Th>Status</Th>
                <Th>Created At</Th>
              </Tr>
            </Thead>
            <Tbody>
              {payments.map((p, index) => (
                <Tr key={p._id}>
                  <Td>{index + 1}</Td>
                  <Td>{p.name || '-'}</Td>
                  <Td>{p.email || '-'}</Td>
                  <Td>{p.whatsappNumber || '-'}</Td>
                  <Td>{p.area || '-'}</Td>
                  <Td>{p.collegeName || '-'}</Td>
                  <Td>{p.gender || '-'}</Td>
                  <Td>{p.dayScholarOrHostler || '-'}</Td>
                  <Td>₹{p.amount || 0}</Td>
                  {/* <Td>{p.razorpay_order_id || '-'}</Td> */}
                  <Td>{p.razorpay_payment_id || '-'}</Td>
                  {/* <Td>
                    <Text maxW="200px" isTruncated>{p.razorpay_signature || '-'}</Text>
                  </Td> */}
                  <Td>
                    <Badge colorScheme={p.paymentSuccess ? 'green' : 'red'}>
                      {p.paymentSuccess ? 'Success' : 'Failed'}
                    </Badge>
                  </Td>
                  <Td>{new Date(p.createdAt).toLocaleString()}</Td>
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
