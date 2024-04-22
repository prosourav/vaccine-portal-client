import { Button, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader } from '@chakra-ui/react';
import React, { SetStateAction } from 'react';
import { useToast } from "@chakra-ui/react";
import { setAppointmentState } from '@/redux/appointmentSlice';
import { useDispatch, useSelector } from 'react-redux';
import { ChildComponentProps } from '@/types/appointment';
import { IRootState } from '@/redux/store';
import userService from '@/services/userService';


const DeleteUser = ({ setModalVisible, currentItem }: ChildComponentProps) => {
  const toast = useToast();
  const dispatch = useDispatch();
  const { operation } = useSelector((state: IRootState) => state.appointmentStore);


  const handleDelete = async (item: string) => {
    try {
      await userService.deleteUser(item);
      dispatch(setAppointmentState(!operation));
      toast({
        title: `Appointment Deleted Successfully`,
        position: 'top-right',
        status: 'success',
        isClosable: true,
      });
      setModalVisible((prv) => ({ ...prv, ['delete']: false }));

    } catch (error) {
      toast({
        title: `Something went wrong`,
        position: 'top-right',
        status: 'error',
        isClosable: true,
      })
    }
  };


  return (
    <div>
      <ModalContent>
        <ModalHeader>Delete User</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          Are you sure to delete this user?
        </ModalBody>

        <ModalFooter>
          <Button colorScheme='blue' mr={3} onClick={() => setModalVisible((prv) => ({ ...prv, ['delete']: false }))}>
            Close
          </Button>
          <Button onClick={() => handleDelete(currentItem)} colorScheme="red" >Delete</Button>
        </ModalFooter>
      </ModalContent>
    </div>
  );
};

export default DeleteUser;