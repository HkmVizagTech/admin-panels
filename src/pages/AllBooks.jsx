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
      const response = await fetch("http://localhost:2346/api/whatsapp/getAllBooks")
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
      const response = await fetch(`http://localhost:2346/api/whatsapp/deleteBook/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to delete book")
      }

      setBooks(books.filter((book) => book._id !== id))
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
      <VStack spacing={4}>
        <Alert status="error">
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
    <Box>
      <Flex align="center" mb={6}>
        <Heading size="lg" color="gray.700">
          All Books
        </Heading>
        <Spacer />
        <Button as={RouterLink} to="/addBook" colorScheme="blue">
          Add New Book
        </Button>
      </Flex>

      {books.length === 0 ? (
        <Alert status="info">
          <AlertIcon />
          No books found. Add your first book to get started!
        </Alert>
      ) : (
        <VStack spacing={4} align="stretch">
          {books.map((book) => (
            <Card key={book._id} variant="outline" _hover={{ shadow: "md" }}>
              <CardBody>
                <Flex align="center">
                  <Box flex="1">
                    <Text fontSize="lg" fontWeight="semibold">
                      {book.title}
                    </Text>
                    <Text fontSize="sm" color="gray.500">
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
          ))}
        </VStack>
      )}
    </Box>
    </Layout>
  )
}

export default AllBooks
