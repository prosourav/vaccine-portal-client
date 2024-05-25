import { ModalProps } from "@/types/Modal"
import { Modal, ModalOverlay } from "@chakra-ui/react"

export const ChakraModal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {


  return (

    <Modal isCentered isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      {children}
    </Modal>
  )
};
