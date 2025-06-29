"use client"

import { useState, useEffect } from "react"
import {
  Box,
  VStack,
  Text,
  Button,
  Card,
  CardBody,
  Heading,
  Alert,
  AlertIcon,
  Spinner,
  HStack,
  Badge,
  useToast,
  IconButton,
  Flex,
  Stack,
  useBreakpointValue,
} from "@chakra-ui/react"
import { useParams, useNavigate, Link as RouterLink } from "react-router-dom"
import { ArrowBackIcon, DeleteIcon } from "@chakra-ui/icons"

const BookDetails = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const toast = useToast()

  const [book, setBook] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const fetchBook = async () => {
    if (!id) return

    try {
      setIsLoading(true)
      setError(null)
      const response = await fetch(`https://razor-pay-server-389286764509.asia-south1.run.app/book/getBook/${id}`)

      if (!response.ok) {
        if (response.status === 404) throw new Error("Book not found")
        throw new Error("Failed to fetch book")
      }

      const data = await response.json()
      setBook(data)
    } catch (err) {
      setError(err.message || "An error occurred")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchBook()
  }, [id])

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this book?")) return

    try {
      setIsDeleting(true)
      const response = await fetch(`https://razor-pay-server-389286764509.asia-south1.run.app/book/deleteBook/${id}`, {
        method: "DELETE",
      })

      if (!response.ok) throw new Error("Failed to delete book")

      toast({
        title: "Book deleted successfully",
        status: "success",
        duration: 3000,
        isClosable: true,
      })
      navigate("/")
    } catch (err) {
      toast({
        title: "Error deleting book",
        description: err.message || "An error occurred",
        status: "error",
        duration: 3000,
        isClosable: true,
      })
    } finally {
      setIsDeleting(false)
    }
  }

  if (isLoading) {
    return (
      <Box textAlign="center" py={10} px={4}>
        <IconButton
          icon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          aria-label="Go back"
          variant="ghost"
          mb={4}
        />
        <Spinner size="xl" color="blue.500" />
        <Text mt={4}>Loading book details...</Text>
      </Box>
    )
  }

  if (error) {
    return (
      <VStack spacing={6} px={4} py={8}>
        <IconButton
          icon={<ArrowBackIcon />}
          onClick={() => navigate(-1)}
          aria-label="Go back"
          variant="ghost"
          alignSelf="flex-start"
        />
        <Alert status="error" width="full">
          <AlertIcon />
          {error}
        </Alert>
        <Stack direction={{ base: "column", sm: "row" }} spacing={4}>
          <Button as={RouterLink} to="/" leftIcon={<ArrowBackIcon />}>
            Back to All Books
          </Button>
          <Button onClick={fetchBook} colorScheme="blue">
            Try Again
          </Button>
        </Stack>
      </VStack>
    )
  }

  return (
    <Box px={{ base: 4, md: 8 }} py={8}>
      <Flex justify="space-between" align="center" mb={6} wrap="wrap">
        <Button as={RouterLink} to="/" leftIcon={<ArrowBackIcon />} variant="ghost" mb={{ base: 4, md: 0 }}>
          Back to All Books
        </Button>
      </Flex>

      {book && (
        <Card w="full">
          <CardBody>
            <VStack align="start" spacing={6}>
              <HStack wrap="wrap">
                <Heading size={{ base: "md", md: "lg" }}>{book.title}</Heading>
                <Badge colorScheme="blue">Book</Badge>
              </HStack>

              <Box>
                <Text fontWeight="semibold" color="gray.600">
                  Book ID:
                </Text>
                <Text fontFamily="mono" fontSize="sm" color="gray.500" wordBreak="break-all">
                  {book._id}
                </Text>
              </Box>

              <HStack spacing={4} pt={4} wrap="wrap">
                <Button
                  colorScheme="red"
                  leftIcon={<DeleteIcon />}
                  onClick={handleDelete}
                  isLoading={isDeleting}
                  loadingText="Deleting..."
                >
                  Delete Book
                </Button>
              </HStack>
            </VStack>
          </CardBody>
        </Card>
      )}
    </Box>
  )
}

export default BookDetails
