import appointmentService from '@/services/appointmentService';
import { Button, Input, FormControl, FormErrorMessage, FormLabel, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, Select } from '@chakra-ui/react';
import React, { ChangeEvent, FormEventHandler, ReactNode, SetStateAction, useCallback, useEffect, useState } from 'react';
import { useToast } from "@chakra-ui/react";
import { useDispatch, useSelector } from 'react-redux';
import { ChildComponentProps } from '@/types/appointment';
import useFetch from '@/hooks/useFetch';
import moment from 'moment';
import { IRootState } from '@/redux/store';
import { setAppointmentState } from '@/redux/appointmentSlice';
import { defaultValues, userStatus } from '@/constants/user';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { UserType } from '@/types/user';
import userService from '@/services/userService';
import { userformSchema } from '@/Schema/user';


const UserEdit = ({ setModalVisible, currentItem }: ChildComponentProps) => {
 const [values, updateValues] = useState({ ...defaultValues});
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
    resolver: zodResolver(userformSchema),
    values,
});


  const getUserDetails = useCallback(() => {
    return userService.getSingleUser(currentItem);
  }, [currentItem]);

  const { data, error, isLoading, isError, isSuccess } =
    useFetch(getUserDetails);

    // console.log("data: ", data?.data?.id);
    useEffect(()=>updateValues((prv)=> ({...prv, email: data?.data?.email, password:'**********', status: data?.data?.status })), [data?.data]);

  const handleChange = ({ target }:{ target:{name: string, value: string}}) => {
    updateValues((prv: SetStateAction<UserType>) => ({ ...prv, [target.name]: target.value } as UserType));
  };

  // getting called on onSubmit
  const onSubmit = async (payload: UserType) => {
    setDisable(true);

    try {
      const response = await userService.updateUser(data?.data?.id, payload);
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
    setModalVisible((prv) => ({ ...prv, ['edit']: false }));
  };


  return (
    <div>
      <ModalContent>
        <ModalHeader>Edit User</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <form className="space-y-4 md:space-y-6" onSubmit={handleSubmit(onSubmit)} >
              {/* {console.log(errors) as ReactNode} */}
                <FormControl isInvalid={errors.email?.message as undefined} isRequired>
                    <FormLabel className='block mb-2 text-sm font-medium'>Email</FormLabel>
                    <Input {...register("email")} 
                     value={values?.email}
                     onChange={handleChange}
                     placeholder='johndoe@example.com' className='bg-green-100 border border-green-300 sm:text-sm rounde-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5' />
                    <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
                </FormControl>


                <FormControl isInvalid={errors.password?.message as boolean | undefined} isRequired>
                    <FormLabel className='block mb-2 text-sm font-medium '>Password</FormLabel>
                    <Input {...register("password")} type='password' placeholder='**********' value={values?.password}
                            onChange={handleChange}
                        className='bg-green-100 border border-green-300  sm:text-sm rounde-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5' />
                    <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
                </FormControl>

                <FormControl className='py-2 flex items-center ' isRequired>
                <FormLabel> Status: </FormLabel>
                    <span className='w-30 pl-1'>
                        <Select {...register("status")} disabled={role == 'user'} value={values?.status} 
                            onChange={handleChange}
                        >
                            {userStatus.map((item: string) => <option key={item} value={item.toLocaleLowerCase()}>{item}</option>)}
                        </Select>
                    </span>
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
            Update
          </Button>
        </ModalFooter>
      </ModalContent>
    </div>
  );
};

export default UserEdit;

// Change role
// change email password status