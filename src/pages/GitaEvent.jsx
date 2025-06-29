import { useState, useEffect } from "react"
import {
  ChakraProvider,
  Box,
  VStack,
  HStack,
  Heading,
  Button,
  Input,
  FormControl,
  FormLabel,
  Textarea,
  Card,
  CardBody,
  CardHeader,
  Text,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useToast,
  IconButton,
  Flex,
  Spinner,
  Center,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from "@chakra-ui/react"
import { EditIcon, DeleteIcon, AddIcon, CalendarIcon } from "@chakra-ui/icons"

const API_BASE_URL = "https://razor-pay-server-389286764509.asia-south1.run.app" // Adjust this to your API URL

function GitaEvent() {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [formData, setFormData] = useState({
    name: "",
    date: "",
    time: "",
    linkBox: "",
  })

  const { isOpen: isCreateOpen, onOpen: onCreateOpen, onClose: onCreateClose } = useDisclosure()
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure()
  const { isOpen: isViewOpen, onOpen: onViewOpen, onClose: onViewClose } = useDisclosure()

  const toast = useToast()

  // Fetch all events
  const fetchEvents = async () => {
    try {
      setLoading(true)
      const response = await fetch(`${API_BASE_URL}/events`)
      if (response.ok) {
        const data = await response.json()
        setEvents(data)
      } else {
        throw new Error("Failed to fetch events")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch events",
        status: "error",
        duration: 3000,
        isClosable: true,
      })
    } finally {
      setLoading(false)
    }
  }

  // Fetch single event
  const fetchEvent = async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/event/${id}`)
      if (response.ok) {
        const data = await response.json()
        setSelectedEvent(data)
        onViewOpen()
      } else {
        throw new Error("Event not found")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch event details",
        status: "error",
        duration: 3000,
        isClosable: true,
      })
    }
  }

  // Create event
  const createEvent = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/event/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Event created successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        })
        fetchEvents()
        onCreateClose()
        resetForm()
      } else {
        throw new Error("Failed to create event")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create event",
        status: "error",
        duration: 3000,
        isClosable: true,
      })
    }
  }

  // Update event
  const updateEvent = async () => {
    if (!selectedEvent) return

    try {
      const response = await fetch(`${API_BASE_URL}/event/${selectedEvent._id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Event updated successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        })
        fetchEvents()
        onEditClose()
        resetForm()
      } else {
        throw new Error("Failed to update event")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update event",
        status: "error",
        duration: 3000,
        isClosable: true,
      })
    }
  }

  // Delete event
  const deleteEvent = async (id) => {
    if (!window.confirm("Are you sure you want to delete this event?")) return

    try {
      const response = await fetch(`${API_BASE_URL}/event/${id}`, {
        method: "DELETE",
      })

      if (response.ok) {
        toast({
          title: "Success",
          description: "Event deleted successfully",
          status: "success",
          duration: 3000,
          isClosable: true,
        })
        fetchEvents()
      } else {
        throw new Error("Failed to delete event")
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete event",
        status: "error",
        duration: 3000,
        isClosable: true,
      })
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      date: "",
      time: "",
      linkBox: "",
    })
  }

  const openEditModal = (event) => {
    setSelectedEvent(event)
    setFormData({
      name: event.name,
      date: event.date.split("T")[0], // Format date for input
      time: event.time,
      linkBox: event.linkBox,
    })
    onEditOpen()
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  useEffect(() => {
    fetchEvents()
  }, [])

  return (
    <ChakraProvider>
      <Box maxW="1200px" mx="auto" p={6}>
        <VStack spacing={6} align="stretch">
          {/* Header */}
          <Flex
            direction={{ base: "column", md: "row" }}
            justify="space-between"
            align={{ base: "flex-start", md: "center" }}
            gap={4}
          >
            <Heading size="lg" color="blue.600" textAlign={{ base: "left", md: "inherit" }}>
              Event Management
            </Heading>
            <Button
              leftIcon={<AddIcon />}
              colorScheme="blue"
              onClick={() => {
                resetForm()
                onCreateOpen()
              }}
              w={{ base: "full", md: "auto" }}
            >
              Create Event
            </Button>
          </Flex>

          {/* Events List */}
          {loading ? (
            <Center py={10}>
              <Spinner size="xl" color="blue.500" />
            </Center>
          ) : events.length === 0 ? (
            <Alert status="info">
              <AlertIcon />
              <AlertTitle>No events found!</AlertTitle>
              <AlertDescription>Create your first event to get started.</AlertDescription>
            </Alert>
          ) : (
            <VStack spacing={4} align="stretch">
              {events.map((event) => (
                <Card key={event._id} variant="outline">
                  <CardHeader>
                    <Flex justify="space-between" align="center" wrap="wrap" gap={2}>
                      <VStack align="start" spacing={1}>
                        <Heading size="md">{event.name}</Heading>
                        <HStack>
                          <CalendarIcon color="gray.500" />
                          <Text color="gray.600">
                            {formatDate(event.date)} at {event.time}
                          </Text>
                        </HStack>
                      </VStack>
                      <Flex wrap="wrap" gap={2}>
                        <Button size="sm" variant="outline" onClick={() => fetchEvent(event._id)}>
                          View
                        </Button>
                        <IconButton
                          aria-label="Edit event"
                          icon={<EditIcon />}
                          size="sm"
                          colorScheme="blue"
                          variant="outline"
                          onClick={() => openEditModal(event)}
                        />
                        <IconButton
                          aria-label="Delete event"
                          icon={<DeleteIcon />}
                          size="sm"
                          colorScheme="red"
                          variant="outline"
                          onClick={() => deleteEvent(event._id)}
                        />
                      </Flex>
                    </Flex>
                  </CardHeader>
                  {event.linkBox && (
                    <CardBody pt={0}>
                      <Text fontSize="sm" color="gray.600" noOfLines={2}>
                        {event.linkBox}
                      </Text>
                    </CardBody>
                  )}
                </Card>
              ))}
            </VStack>
          )}
        </VStack>

        {/* Create Event Modal */}
        <Modal isOpen={isCreateOpen} onClose={onCreateClose} size={{ base: "full", md: "lg" }}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Create New Event</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Event Name</FormLabel>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter event name"
                    w="full"
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Date</FormLabel>
                  <Input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    w="full"
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Time</FormLabel>
                  <Input
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    w="full"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Description/Link</FormLabel>
                  <Textarea
                    value={formData.linkBox}
                    onChange={(e) => setFormData({ ...formData, linkBox: e.target.value })}
                    placeholder="Enter event description or link"
                    rows={3}
                    w="full"
                  />
                </FormControl>
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onCreateClose}>
                Cancel
              </Button>
              <Button
                colorScheme="blue"
                onClick={createEvent}
                isDisabled={!formData.name || !formData.date || !formData.time}
              >
                Create Event
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* Edit Event Modal */}
        <Modal isOpen={isEditOpen} onClose={onEditClose} size={{ base: "full", md: "lg" }}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Edit Event</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <VStack spacing={4}>
                <FormControl isRequired>
                  <FormLabel>Event Name</FormLabel>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Enter event name"
                    w="full"
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Date</FormLabel>
                  <Input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    w="full"
                  />
                </FormControl>
                <FormControl isRequired>
                  <FormLabel>Time</FormLabel>
                  <Input
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    w="full"
                  />
                </FormControl>
                <FormControl>
                  <FormLabel>Description/Link</FormLabel>
                  <Textarea
                    value={formData.linkBox}
                    onChange={(e) => setFormData({ ...formData, linkBox: e.target.value })}
                    placeholder="Enter event description or link"
                    rows={3}
                    w="full"
                  />
                </FormControl>
              </VStack>
            </ModalBody>
            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={onEditClose}>
                Cancel
              </Button>
              <Button
                colorScheme="blue"
                onClick={updateEvent}
                isDisabled={!formData.name || !formData.date || !formData.time}
              >
                Update Event
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>

        {/* View Event Modal */}
        <Modal isOpen={isViewOpen} onClose={onViewClose} size={{ base: "full", md: "md" }}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>Event Details</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              {selectedEvent ? (
                <>
                  <Heading size="md" mb={2}>
                    {selectedEvent.name}
                  </Heading>
                  <Text mb={2}>
                    <strong>Date:</strong> {formatDate(selectedEvent.date)}
                  </Text>
                  <Text mb={2}>
                    <strong>Time:</strong> {selectedEvent.time}
                  </Text>
                  {selectedEvent.linkBox && (
                    <Text>
                      <strong>Description/Link:</strong> {selectedEvent.linkBox}
                    </Text>
                  )}
                </>
              ) : (
                <Text>No event details available.</Text>
              )}
            </ModalBody>
            <ModalFooter>
              <Button onClick={onViewClose}>Close</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </ChakraProvider>
  )
}

export default GitaEvent
