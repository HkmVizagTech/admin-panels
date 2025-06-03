

// import type React from "react"
import { useState } from "react"
import {
  Box,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Button,
  Card,
  CardBody,
  Heading,
  useToast,
  Alert,
  AlertIcon,
  HStack,
} from "@chakra-ui/react"
import { useNavigate, Link as RouterLink } from "react-router-dom"
import { ArrowBackIcon } from "@chakra-ui/icons"
import Layout from "../components/Layout"

const AddBook = () => {
  const [title, setTitle] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState(null)
  const toast = useToast()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!title.trim()) {
      toast({
        title: "Title required",
        description: "Please enter a book title",
        status: "warning",
        duration: 3000,
        isClosable: true,
      })
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      const response = await fetch("http://localhost:2346/api/whatsapp/addBook", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title: title.trim() }),
      })

      if (!response.ok) {
        throw new Error("Failed to add book")
      }

      const newBook = await response.json()

      toast({
        title: "Book added successfully",
        description: `"${newBook.title}" has been added to your library`,
        status: "success",
        duration: 3000,
        isClosable: true,
      })

      setTitle("")
      navigate("/getAllBooks")
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred"
      setError(errorMessage)
      toast({
        title: "Error adding book",
        description: errorMessage,
        status: "error",
        duration: 3000,
        isClosable: true,
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Layout>
    <Box>
      <Button as={RouterLink} to="/" leftIcon={<ArrowBackIcon />} mb={6} variant="ghost">
        Back to All Books
      </Button>

      <Card maxW="md" mx="auto">
        <CardBody>
          <VStack spacing={6}>
            <Heading size="lg" textAlign="center" color="gray.700">
              Add New Book
            </Heading>

            <Box w="full">
              <form onSubmit={handleSubmit}>
                <VStack spacing={4}>
                  <FormControl isRequired>
                    <FormLabel>Book Title</FormLabel>
                    <Input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Enter book title"
                      focusBorderColor="blue.500"
                      disabled={isLoading}
                    />
                  </FormControl>

                  <HStack spacing={4} w="full">
                    <Button type="button" variant="outline" onClick={() => setTitle("")} flex="1" disabled={isLoading}>
                      Clear
                    </Button>
                    <Button type="submit" colorScheme="blue" isLoading={isLoading} loadingText="Adding..." flex="1">
                      Add Book
                    </Button>
                  </HStack>
                </VStack>
              </form>
            </Box>

            {error && (
              <Alert status="error" borderRadius="md">
                <AlertIcon />
                {error}
              </Alert>
            )}
          </VStack>
        </CardBody>
      </Card>
    </Box>
    </Layout>
  )
}

export default AddBook
