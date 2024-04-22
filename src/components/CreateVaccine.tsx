import { Button, FormControl, FormErrorMessage, FormLabel, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, Select } from '@chakra-ui/react';
import React, { useMemo, useState } from 'react';
import { useToast } from "@chakra-ui/react";
import { useDispatch, useSelector } from 'react-redux';
import { ChildComponentProps, VaccinePayloadType } from '@/types/vaccine';
import { IRootState } from '@/redux/store';
import { vaccineOptions } from '@/constants/vaccines';
import vaccineService from '@/services/vaccineService';
import { setAppointmentState } from '@/redux/appointmentSlice';


const CreateVaccine = ({ setModalVisible, currentItem }: ChildComponentProps) => {
  const [vaccine, setVaccine] = useState('');
  const toast = useToast();
  const dispatch = useDispatch();
  const { operation } = useSelector((state: IRootState) => state.appointmentStore);
  const [disable, setDisable] = useState(true);

  const handleSubmit = async () => {
    console.log('data', vaccine);

    // Uncomment and replace with your API call logic
    try {
      const response = await vaccineService.addVaccine({ name: vaccine });
      toast({
        title: response?.message,
        position: 'top-right',
        status: 'success',
        isClosable: true,
      });
      dispatch(setAppointmentState(!operation));
      handleClose();
    } catch (error: any) {
      toast({
        title: error.response.data.message,
        position: 'top-right',
        status: 'error',
        isClosable: true,
      });
    } finally {
      setDisable(false);
    }
  };

  const handleClose = () => {
    setModalVisible(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setVaccine(e.target.value);
    return e.target.value ? setDisable(false) : setDisable(true);
  };



  return (
    <div>
      <ModalContent>
        <ModalHeader>Add Vaccine</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
            <form className="space-y-4 md:space-y-6">
              <FormControl isRequired>
                <FormLabel className="block mb-2 text-sm font-medium text-green-900">
                  Vaccine
                </FormLabel>
                <Select
                  placeholder="Select Vaccine"
                  value={vaccine}
                  onChange={handleChange}
                >
                  {vaccineOptions.map((item, index) => (
                    <option value={item} key={index}>
                      {item}
                    </option>
                  ))}
                </Select>
                <FormErrorMessage>Error</FormErrorMessage>
              </FormControl>
            </form>
          </div>
        </ModalBody>

        <ModalFooter>
          <Button colorScheme="blue" mr={3} onClick={handleClose}>
            Close
          </Button>
          <Button
            isDisabled={disable}
            onClick={handleSubmit}
            colorScheme="green"
          >
            Create
          </Button>
        </ModalFooter>
      </ModalContent>
    </div>
  );
};

export default CreateVaccine;
