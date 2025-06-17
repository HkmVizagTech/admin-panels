"use client"

import { useState, useEffect } from "react"
import {
  Box,
  Container,
  Heading,
  SimpleGrid,
  Card,
  CardBody,
  CardHeader,
  Text,
  VStack,
  HStack,
  Badge,
  Spinner,
  Alert,
  AlertIcon,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Flex,
  Icon,
} from "@chakra-ui/react"
import { CalendarIcon, EmailIcon, PhoneIcon, AtSignIcon } from "@chakra-ui/icons"
import DeleteConfirmationModal from "./DeleteConfirmationModal"

// Replace this with your actual backend URL
const API_BASE_URL = "https://event-pass-backend-production.up.railway.app" // Adjust to your Express.js server URL

function EventsDashboard() {
  const [events, setEvents] = useState([])
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [registrationLoading, setRegistrationLoading] = useState(false)
  const [error, setError] = useState(null)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [deleteLoading, setDeleteLoading] = useState({})
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [eventToDelete, setEventToDelete] = useState(null)
  const [deleteError, setDeleteError] = useState(null)
  const [isDeleting, setIsDeleting] = useState(false)

  // Fetch all events
  useEffect(() => {
    fetchEvents()
  }, [])

  const fetchEvents = async () => {
    try {
      setLoading(true)
      setError(null)
      const response = await fetch(`${API_BASE_URL}/events`)
      if (!response.ok) {
        throw new Error("Failed to fetch events")
      }
      const data = await response.json()
      setEvents(data)
    } catch (err) {
      setError(err.message || "An error occurred while fetching events")
      console.error("Error fetching events:", err)
    } finally {
      setLoading(false)
    }
  }

  const fetchEventRegistrations = async (eventId) => {
    try {
      setRegistrationLoading(true)
      setError(null)
      const response = await fetch(`${API_BASE_URL}/event-registrations/${eventId}`)

      if (!response.ok) {
        if (response.status === 404) {
          // No registrations found for this event
          const eventTitle = events.find((e) => e._id === eventId)?.title || "Unknown Event"
          setSelectedEvent({
            _id: eventId,
            eventTitle: eventTitle,
            students: [],
          })
          return
        }
        throw new Error("Failed to fetch event registrations")
      }

      const data = await response.json()
      setSelectedEvent(data)
    } catch (err) {
      setError(err.message || "An error occurred while fetching registrations")
      console.error("Error fetching registrations:", err)
    } finally {
      setRegistrationLoading(false)
    }
  }

  const handleDeleteClick = (e, event) => {
    e.stopPropagation() // Prevent the card click event
    setEventToDelete(event)
    setDeleteError(null)
    setDeleteModalOpen(true)
  }

  const confirmDelete = async () => {
    if (!eventToDelete) return

    try {
      setIsDeleting(true)
      setDeleteError(null)

      const response = await fetch(`${API_BASE_URL}/events/${eventToDelete._id}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || "Failed to delete event")
      }

      // Remove the deleted event from the state
      setEvents((prevEvents) => prevEvents.filter((event) => event._id !== eventToDelete._id))

      // Close modal and reset state
      setDeleteModalOpen(false)
      setEventToDelete(null)
    } catch (err) {
      setDeleteError(err.message || "An error occurred while deleting the event")
      console.error("Error deleting event:", err)
    } finally {
      setIsDeleting(false)
    }
  }

  const closeDeleteModal = () => {
    if (!isDeleting) {
      setDeleteModalOpen(false)
      setEventToDelete(null)
      setDeleteError(null)
    }
  }

  const handleEventClick = (event) => {
    fetchEventRegistrations(event._id)
    onOpen()
  }

  const handleCloseModal = () => {
    onClose()
    setSelectedEvent(null)
    setError(null)
  }

  const formatDate = (dateString) => {
    if (!dateString) return ""
    try {
      return new Date(dateString).toLocaleDateString()
    } catch {
      return dateString
    }
  }

  if (loading) {
    return (
      <Container maxW="container.xl" py={8}>
        <Flex justify="center" align="center" minH="200px">
          <VStack spacing={4}>
            <Spinner size="xl" color="brand.500" />
            <Text>Loading events...</Text>
          </VStack>
        </Flex>
      </Container>
    )
  }

  return (
    <Container maxW="container.xl" py={8}>
      <VStack spacing={8} align="stretch">
        <Box textAlign="center">
          <Heading size="2xl" color="brand.700" mb={2}>
            Events Dashboard
          </Heading>
          <Text fontSize="lg" color="gray.600">
            Click on any event to view registered participants
          </Text>
        </Box>

        {error && !isOpen && (
          <Alert status="error">
            <AlertIcon />
            {error}
            <Button ml={4} size="sm" onClick={fetchEvents}>
              Retry
            </Button>
          </Alert>
        )}

        {events.length === 0 && !loading ? (
          <Alert status="info">
            <AlertIcon />
            No events found. Make sure your backend server is running.
          </Alert>
        ) : (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
            {events.map((event) => (
              <Card
                key={event._id}
                cursor="pointer"
                transition="all 0.2s"
                _hover={{
                  transform: "translateY(-4px)",
                  shadow: "lg",
                  borderColor: "brand.500",
                }}
                onClick={() => handleEventClick(event)}
                borderWidth="1px"
                borderColor="gray.200"
                position="relative"
              >
                <CardHeader pb={2}>
                  <HStack justify="space-between" align="start">
                    <Heading size="md" color="brand.700" noOfLines={2} flex="1" mr={2}>
                      {event.title}
                    </Heading>
                    <HStack spacing={2}>
                      <Icon as={CalendarIcon} color="brand.500" />
                      <Button
                        size="sm"
                        colorScheme="red"
                        variant="ghost"
                        onClick={(e) => handleDeleteClick(e, event)}
                        _hover={{ bg: "red.50" }}
                        aria-label={`Delete ${event.title}`}
                      >
                        Delete
                      </Button>
                    </HStack>
                  </HStack>
                </CardHeader>
                <CardBody pt={0}>
                  <VStack align="start" spacing={2}>
                    {event.description && (
                      <Text fontSize="sm" color="gray.600" noOfLines={3}>
                        {event.description}
                      </Text>
                    )}
                    {event.date && (
                      <HStack>
                        <CalendarIcon color="gray.500" boxSize={3} />
                        <Text fontSize="sm" color="gray.500">
                          {formatDate(event.date)}
                        </Text>
                      </HStack>
                    )}
                    {event.location && (
                      <HStack>
                        <AtSignIcon color="gray.500" boxSize={3} />
                        <Text fontSize="sm" color="gray.500">
                          {event.location}
                        </Text>
                      </HStack>
                    )}
                    {event.category && (
                      <Badge colorScheme="brand" variant="subtle">
                        {event.category}
                      </Badge>
                    )}
                  </VStack>
                </CardBody>
              </Card>
            ))}
          </SimpleGrid>
        )}
      </VStack>

      {/* Event Registrations Modal */}
      <Modal isOpen={isOpen} onClose={handleCloseModal} size="4xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <VStack align="start" spacing={1}>
              <Text>{selectedEvent?.eventTitle}</Text>
              <Text fontSize="sm" color="gray.500">
                Registered Participants ({selectedEvent?.students?.length || 0})
              </Text>
            </VStack>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {error && (
              <Alert status="error" mb={4}>
                <AlertIcon />
                {error}
              </Alert>
            )}

            {registrationLoading ? (
              <Flex justify="center" py={8}>
                <VStack spacing={4}>
                  <Spinner size="lg" color="brand.500" />
                  <Text>Loading registrations...</Text>
                </VStack>
              </Flex>
            ) : selectedEvent?.students?.length === 0 ? (
              <Alert status="info">
                <AlertIcon />
                No participants registered for this event yet.
              </Alert>
            ) : (
              <TableContainer>
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th>Name</Th>
                      <Th>Email</Th>
                      <Th>Phone</Th>
                      <Th>Location</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {selectedEvent?.students?.map((student, index) => (
                      <Tr key={index}>
                        <Td fontWeight="medium">{student.name}</Td>
                        <Td>
                          <HStack>
                            <EmailIcon color="gray.500" boxSize={3} />
                            <Text>{student.email}</Text>
                          </HStack>
                        </Td>
                        <Td>
                          <HStack>
                            <PhoneIcon color="gray.500" boxSize={3} />
                            <Text>{student.phone}</Text>
                          </HStack>
                        </Td>
                        <Td>{student.location}</Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </TableContainer>
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="brand" onClick={handleCloseModal}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={deleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={confirmDelete}
        eventTitle={eventToDelete?.title}
        isLoading={isDeleting}
        error={deleteError}
      />
    </Container>
  )
}

export default EventsDashboard
