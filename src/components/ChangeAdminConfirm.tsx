import appointmentService from '@/services/appointmentService';
import { Button, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader } from '@chakra-ui/react';
import React, { SetStateAction } from 'react';
import { useToast } from "@chakra-ui/react";
import { setAppointmentState } from '@/redux/appointmentSlice';
import { useDispatch, useSelector } from 'react-redux';
import { ChildComponentProps } from '@/types/appointment';
import { IRootState } from '@/redux/store';
import userService from '@/services/userService';
import { setAvailabilityState } from '@/redux/availabilitySlice';
import { setUserState } from '@/redux/userSlice';
import authService from '@/services/authService';
import router from 'next/router';
import Cookies from 'js-cookie';


const ChangeAdmin = ({ setModalVisible, currentItem }: ChildComponentProps) => {
  const toast = useToast();
  const dispatch = useDispatch();
//   const { operation } = useSelector((state: IRootState) => state.appointmentStore);
  const user = Cookies.get('id');


  const handleDelete = async (item: string) => {
    try {
      const response = await userService.changeAdmin(item);
        if(response){
            handleLogOut();
        }
      toast({
        title: `Admin Changed Successfully`,
        position: 'top-right',
        status: 'success',
        isClosable: true,
      });
      setModalVisible((prv) => ({ ...prv, ['role']: false }));

    } catch (error) {
      toast({
        title: `Something went wrong`,
        position: 'top-right',
        status: 'error',
        isClosable: true,
      })
    }
  };



  const handleLogOut =  async () => {
    try {
      await authService.logout(user as string);
      Cookies.remove('accessToken');
      Cookies.remove('refreshToken');
      Cookies.remove('id');
      dispatch(setUserState({}));
      dispatch(setAvailabilityState({}));
      router.push('/');
    } catch (error) {
      console.log(error);
      Cookies.remove('accessToken');
      Cookies.remove('refreshToken');
      Cookies.remove('id');
      dispatch(setUserState({}));
      dispatch(setAvailabilityState({}));
    }

  };


  return (
    <div>
      <ModalContent>
        <ModalHeader>Change Admin</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          Are you sure to change admin?
        </ModalBody>

        <ModalFooter>
          <Button colorScheme='blue' mr={3} onClick={() => setModalVisible((prv) => ({ ...prv, ['role']: false }))}>
            Close
          </Button>
          <Button onClick={() => handleDelete(currentItem)} colorScheme="green" >Change</Button>
        </ModalFooter>
      </ModalContent>
    </div>
  );
};

export default ChangeAdmin;