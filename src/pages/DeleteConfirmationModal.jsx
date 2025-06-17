"use client"

import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Text,
  VStack,
  Alert,
  AlertIcon,
} from "@chakra-ui/react"

function DeleteConfirmationModal({ isOpen, onClose, onConfirm, eventTitle, isLoading, error }) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader color="red.600">Delete Event</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4} align="start">
            {error && (
              <Alert status="error" w="100%">
                <AlertIcon />
                {error}
              </Alert>
            )}
            <Text>
              Are you sure you want to delete <strong>"{eventTitle}"</strong>?
            </Text>
            <Text fontSize="sm" color="gray.600">
              This action cannot be undone. All registrations for this event will also be affected.
            </Text>
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button mr={3} onClick={onClose} disabled={isLoading}>
            Cancel
          </Button>
          <Button colorScheme="red" onClick={onConfirm} isLoading={isLoading} loadingText="Deleting...">
            Delete Event
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export default DeleteConfirmationModal
