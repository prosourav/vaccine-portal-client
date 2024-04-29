import { Button, FormControl, FormErrorMessage, FormLabel, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, Select, Textarea } from '@chakra-ui/react';
import React, { ChangeEventHandler, useMemo, useState } from 'react';
import { useToast } from "@chakra-ui/react";
import { useDispatch, useSelector } from 'react-redux';
import { ChildComponentProps } from '@/types/appointment';
import { IRootState } from '@/redux/store';
import reviewService from '@/services/reviewService';
import { setAppointmentState } from '@/redux/appointmentSlice';


const CreateReview = ({ setModalVisible, currentItem }: ChildComponentProps) => {
  const [review, setReview] = useState('');
  const toast = useToast();
  const dispatch = useDispatch();
  const { operation } = useSelector((state: IRootState) => state.appointmentStore);
  const [disable, setDisable] = useState(true);

  const handleSubmit = async () => {
    const payload = {body: review, appointmentId:currentItem}

    // Uncomment and replace with your API call logic
    try {
      const response = await reviewService.addReview(payload);
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
    setModalVisible((prv) => ({ ...prv, ['review']: false }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if(e.target.value && e.target.value.trim() !== ''){
      setReview(e.target.value);
      return e.target.value ? setDisable(false) : setDisable(true);
    }
  };



  return (
    <div>
      <ModalContent>
        <ModalHeader>Review</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <div>
            <form className="space-y-4 md:space-y-6 h-40">
              <FormControl isRequired>
                <FormLabel className="block mb-2 text-sm font-medium text-green-900">
                  Add Review
                </FormLabel>
                <Textarea placeholder="Enter your comment" lineHeight={4} onChange={handleChange}/>
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

export default CreateReview;
