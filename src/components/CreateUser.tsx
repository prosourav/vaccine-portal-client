import appointmentService from '@/services/appointmentService';
import { Button, Input, FormControl, FormErrorMessage, FormLabel, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, Select } from '@chakra-ui/react';
import React, { ChangeEvent, FormEventHandler, ReactNode, SetStateAction, useCallback, useEffect, useState } from 'react';
import { useToast } from "@chakra-ui/react";
import { useDispatch, useSelector } from 'react-redux';
import { ChildComponentProps } from '@/types/appointment';
import { IRootState } from '@/redux/store';
import { setAppointmentState } from '@/redux/appointmentSlice';
import { defaultCreateValues } from '@/constants/user';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { UserType, UserTypeSubmit } from '@/types/user';
import userService from '@/services/userService';
import { userCreateFormSchema } from '@/Schema/user';


const CreateUser = ({ setModalVisible, currentItem }: ChildComponentProps) => {
 const [values, updateValues] = useState({ ...defaultCreateValues});
  const toast = useToast();
  const { role } = useSelector((state: IRootState) => state.userStore.mainUser);
  const [disable, setDisable] = useState(false);
  const dispatch = useDispatch();
  const {operation} = useSelector((state: IRootState) => state.appointmentStore);


  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
} = useForm({
    resolver: zodResolver(userCreateFormSchema),
    values,
});

  // getting called on onSubmit
  const onSubmit = async (payload: UserTypeSubmit) => {
    setDisable(true);

    try {
      const response = await userService.createUser(payload );
      toast({
        title: response?.messege,
        position: 'top-right',
        status: 'success',
        isClosable: true,
      });
      dispatch(setAppointmentState(!operation))
      handleClose();
    } catch (error: any) {
      toast({
        title: error.response.data.message,
        position: 'top-right',
        status: 'error',
        isClosable: true,
      })
    } finally {
      setDisable(false);
    }
};
  
  const handleClose = () => {
    setModalVisible((prv) => ({ ...prv, ['create']: false }));
  };

  return (
    <div>
      <ModalContent>
        <ModalHeader>Create User</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit(onSubmit)}>
              
                <FormControl isInvalid={errors.name?.message as undefined} isRequired>
                    <FormLabel className='block mb-2 text-sm font-medium'>Name</FormLabel>
                    <Input {...register("name")} 
                     placeholder='John Doe' className='bg-green-100 border border-green-300 sm:text-sm rounde-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5' />
                    <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
                </FormControl>


                <FormControl isInvalid={errors.email?.message as undefined} isRequired>
                    <FormLabel className='block mb-2 text-sm font-medium'>Email</FormLabel>
                    <Input {...register("email")} 
                     placeholder='johndoe@example.com' className='bg-green-100 border border-green-300 sm:text-sm rounde-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5' />
                    <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
                </FormControl>


                <FormControl isInvalid={errors.password?.message as boolean | undefined} isRequired>
                    <FormLabel className='block mb-2 text-sm font-medium '>Password</FormLabel>
                    <Input {...register("password")} type='password' placeholder='**********'
                        className='bg-green-100 border border-green-300  sm:text-sm rounde-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5' />
                    <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
                </FormControl>

            </form>
          </div>

        </ModalBody>

        <ModalFooter>
          <Button colorScheme={role === 'admin' ? 'blue' : 'red'} mr={3} onClick={handleClose}>
            Close
          </Button>
          <Button 
            isDisabled={disable}
            onClick={handleSubmit(onSubmit)}
            colorScheme="green">
            Create
          </Button>
        </ModalFooter>
      </ModalContent>
    </div>
  );
};

export default CreateUser;

