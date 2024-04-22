import appointmentService from '@/services/appointmentService';
import { Button, Input, FormControl, FormErrorMessage, FormLabel, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, Select } from '@chakra-ui/react';
import React, { ChangeEvent, ReactNode, SetStateAction, useCallback, useEffect, useState } from 'react';
import { useToast } from "@chakra-ui/react";
import { useDispatch, useSelector } from 'react-redux';
import { AppointmentType, ChildComponentProps } from '@/types/appointment';
import useFetch from '@/hooks/useFetch';
import moment from 'moment';
import {vaccineOptions} from '@/constants/vaccines';
import { IRootState } from '@/redux/store';
import { setAppointmentState } from '@/redux/appointmentSlice';


const AppointmentEdit = ({ setModalVisible, currentItem }: ChildComponentProps) => {
  const [formData, setFormData] = useState({} as AppointmentType);
  const toast = useToast();
  const { role } = useSelector((state: IRootState) => state.userStore.mainUser);
  const [disable, setDisable] = useState(false);
  const dispatch = useDispatch();
  const {operation} = useSelector((state: IRootState) => state.appointmentStore);



  const getAppointmentDetails = useCallback(() => {
    return appointmentService.getSingleAppointment(currentItem);
  }, [currentItem]);

  const { data, error, isLoading, isError, isSuccess } =
    useFetch(getAppointmentDetails);

  useEffect(() => { setFormData((prv) => ({ ...prv, ['date']: moment(data?.data?.date).format("YYYY-MM-DD"), ['vaccine']: data?.data?.vaccine })) }, [data]);

  const handleForm = ({ target }: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData((prv: SetStateAction<AppointmentType>) => ({ ...prv, [target.name]: target.value } as AppointmentType));
  };

  // getting called on onSubmit
  const updateItem = async (id: string) => {
    setDisable(true);

    const payload = {
      vaccine: formData.vaccine,
      date: formData.date,
    };
    try {
      const response = await appointmentService.updateAppointment(id, payload);
      toast({
        title: response.message,
        position: 'top-right',
        status: 'success',
        isClosable: true,
      });
      handleClose();
      dispatch(setAppointmentState(!operation))
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
        <ModalHeader>Edit Appointment</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
           <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <form className="space-y-4 md:space-y-6">
              <FormControl isRequired>
                <FormLabel className="block mb-2 text-sm font-medium text-green-900">
                  Vaccine
                </FormLabel>
                <Select name={'vaccine'} value={formData.vaccine} placeholder="Select option" onChange={handleForm}>
                  {vaccineOptions.map((item, index) => (
                    <option value={item} key={index}>
                      {item}
                    </option>
                  ))}
                </Select>
                <FormErrorMessage>Error</FormErrorMessage>
              </FormControl>

              <FormControl isRequired>
                <FormLabel className="block mb-2 text-sm font-medium text-green-900">
                  Select Date
                </FormLabel>
                <Input
                  name={'date'}
                  value={formData.date}
                  size="md"
                  type="date"
                  onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleForm(event as unknown as React.ChangeEvent<HTMLSelectElement>)}
                />

                <FormErrorMessage>Error</FormErrorMessage>
              </FormControl>

            </form>
          </div>

        </ModalBody>

        <ModalFooter>
          <Button colorScheme={role === 'admin' ? 'blue' : 'red'} mr={3} onClick={handleClose}>
            Close
          </Button>
          {role === 'admin' && <Button 
            isDisabled={disable}
          onClick={() => updateItem(currentItem)} colorScheme="green">
            Update
          </Button>}
        </ModalFooter>
      </ModalContent>
    </div>
  );
};

export default AppointmentEdit;