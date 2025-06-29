"use client"

import { useState, useEffect } from "react"
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Card,
  CardBody,
  Heading,
  Alert,
  AlertIcon,
  Spinner,
  useToast,
  IconButton,
  Flex,
  Spacer,
  Wrap,
  WrapItem,
} from "@chakra-ui/react"
import { Link as RouterLink } from "react-router-dom"
import { DeleteIcon, ViewIcon } from "@chakra-ui/icons"
import Layout from "../components/Layout"

const AllBooks = () => {
  const [books, setBooks] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [deletingId, setDeletingId] = useState(null)
  const toast = useToast()

  const fetchBooks = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await fetch("https://razor-pay-server-389286764509.asia-south1.run.app/book/getAllBooks")
      if (!response.ok) {
        throw new Error("Failed to fetch books")
      }
      const data = await response.json()
      setBooks(data)
    } catch (err) {
      setError(err.message || "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchBooks()
  }, [])

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this book?")) {
      return
    }

    try {
      setDeletingId(id)
      const response = await fetch(`https://razor-pay-server-389286764509.asia-south1.run.app/book/deleteBook/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete book")
      }

      setBooks((prev) => prev.filter((book) => book._id !== id))
      toast({
        title: "Book deleted successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      })
    } catch (err) {
      toast({
        title: "Error deleting book",
        description: err.message || "An error occurred",
        status: "error",
        duration: 3000,
        isClosable: true,
      })
    } finally {
      setDeletingId(null)
    }
  }

  if (isLoading) {
    return (
      <Layout>
        <Box textAlign="center" py={10}>
          <Spinner size="xl" color="blue.500" />
          <Text mt={4}>Loading books...</Text>
        </Box>
      </Layout>
    )
  }

  if (error) {
    return (
      <Layout>
        <VStack spacing={4} py={8}>
          <Alert status="error" maxW="md">
            <AlertIcon />
            {error}
          </Alert>
          <Button onClick={fetchBooks} colorScheme="blue">
            Try Again
          </Button>
        </VStack>
      </Layout>
    )
  }

  return (
    <Layout>
      <Box px={{ base: 4, md: 8 }} py={{ base: 6, md: 10 }}>
        <Flex direction={{ base: "column", md: "row" }} align="start" gap={4} mb={6}>
          <Heading size={{ base: "md", md: "lg" }} color="gray.700">
            All Books
          </Heading>
          <Spacer />
          <Button
            as={RouterLink}
            to="/addBook"
            colorScheme="blue"
            size={{ base: "sm", md: "md" }}
            alignSelf={{ base: "flex-start", md: "center" }}
          >
            Add New Book
          </Button>
        </Flex>

        {books.length === 0 ? (
          <Alert status="info" borderRadius="md">
            <AlertIcon />
            No books found. Add your first book to get started!
          </Alert>
        ) : (
          <Wrap spacing={4}>
            {books.map((book) => (
              <WrapItem key={book._id} w="100%" maxW={{ base: "100%", md: "48%" }}>
                <Card variant="outline" w="full" _hover={{ shadow: "md" }}>
                  <CardBody>
                    <Flex direction={{ base: "column", sm: "row" }} align="flex-start" gap={4}>
                      <Box flex="1">
                        <Text fontSize="lg" fontWeight="semibold">
                          {book.title}
                        </Text>
                        <Text fontSize="sm" color="gray.500" wordBreak="break-all">
                          ID: {book._id}
                        </Text>
                      </Box>
                      <HStack spacing={2}>
                        <IconButton
                          as={RouterLink}
                          to={`/book/${book._id}`}
                          aria-label="View book"
                          icon={<ViewIcon />}
                          size="sm"
                          colorScheme="blue"
                          variant="outline"
                        />
                        <IconButton
                          aria-label="Delete book"
                          icon={<DeleteIcon />}
                          size="sm"
                          colorScheme="red"
                          variant="outline"
                          onClick={() => handleDelete(book._id)}
                          isLoading={deletingId === book._id}
                        />
                      </HStack>
                    </Flex>
                  </CardBody>
                </Card>
              </WrapItem>
            ))}
          </Wrap>
        )}
      </Box>
    </Layout>
  )
}

export default AllBooks
