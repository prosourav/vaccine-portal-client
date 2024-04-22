import appointmentService from '@/services/appointmentService';
import { Button, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, Select } from '@chakra-ui/react';
import React, { ReactNode, SetStateAction, useCallback, useEffect, useState } from 'react';
import { useToast } from "@chakra-ui/react";
import { setAppointmentState } from '@/redux/appointmentSlice';
import { useDispatch, useSelector } from 'react-redux';
import { ChildComponentProps } from '@/types/appointment';
import useFetch from '@/hooks/useFetch';
import moment from 'moment';
import {vaccineOptions} from '@/constants/vaccines';
import { IRootState } from '@/redux/store';


const AppointmentDetails = ({ setModalVisible, currentItem }: ChildComponentProps) => {
  const [selected, setSelected] = useState({ vaccine: '', status: '', date: '' });
  const toast = useToast();
  const dispatch = useDispatch();
  const { role } = useSelector((state: IRootState) => state.userStore.mainUser);
  const { availability } = useSelector((state: IRootState) => state.availabilityStore);
  const { operation } = useSelector((state: IRootState) => state.appointmentStore);



  const getAppointmentDetails = useCallback(() => {
    return appointmentService.getSingleAppointment(currentItem);
  }, [currentItem]);

  const { data, error, isLoading, isError, isSuccess } =
    useFetch(getAppointmentDetails);

  useEffect(() => { setSelected((prv) => ({ ...prv, ['status']: data?.data?.status, ['vaccine']: data?.data?.vaccine, ['date']: moment(data?.data?.date).format('DD-MM-YYYY') })) }, [data?.data?.date, data?.data?.status, data?.data?.vaccine]);

  // getting called on onChange 
  const updateStatus = async (data: string, id: string) => {
    setSelected((prv) => ({ ...prv, ['status']: data }))
    try {
      const response = await appointmentService.updateAppointmentStatus(id);
      toast({
        title: response.message,
        position: 'top-right',
        status: 'success',
        isClosable: true,
      });
      dispatch(setAppointmentState(!operation))

    } catch (error: any) {
      // console.log("error: ", error.response.data.message);
      toast({
        title: error.response.data.message,
        position: 'top-right',
        status: 'error',
        isClosable: true,
      })
    }
  };

  const handleClose = () => {
    setModalVisible((prv) => ({ ...prv, ['view']: false }));
  };


  return (
    <div>
      <ModalContent>
        <ModalHeader>Appointment Details</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <div className='py-2'>
            <span className=' font-semibold pr-2'>
              User Name :
            </span>
            {data?.data?.name}
          </div>

          <div className='py-2'>
            <span className=' font-semibold pr-2'>
              User Id :
            </span>
            #{(data?.data?.user)}
          </div>

          <div className='py-2'>
            <span className=' font-semibold pr-2'>
              Appointment Id :
            </span>
            #{data?.data?.id}
          </div>

          <div className='py-2 flex items-center '>
            <div className=' font-semibold pr-2'>
              Vaccine :
            </div>
            <div className=' w-36 pl-1'>
              {role !== 'doctor' ? selected.vaccine :
                <Select value={selected.vaccine} onChange={(event) => setSelected((prv) => ({ ...prv, ['vaccine']: event.target.value }))}>
                  {vaccineOptions.map((item, idx) => <option key={idx} value={item}>{item}</option>)}
                </Select>}
            </div>
          </div>


          <div className='py-2 flex  items-center'>
            <span className=' font-semibold pr-2'>
              Appointment Date:
            </span>
            <span className='w-30 pl-1'>
              {role !== 'doctor' ? selected.date :
                <Select value={selected.date}
                  onChange={(event) => setSelected((prv) => ({ ...prv, ['date']: event.target.value }))}
                >
                  <option key={selected.date} value={selected.date}>{selected.date}</option>
                  {availability.map((item) => <option key={item} value={moment(item).format('DD-MM-YYYY')}>{moment(item).format('DD-MM-YYYY')}</option>)}
                </Select>
              }
            </span>
          </div>

          <div className='py-2 flex items-center '>
            <span className=' font-semibold pr-2'>
              Status:
            </span>
            <span className='w-30 pl-1'>
              <Select disabled={role == 'user'} value={selected.status}
                onChange={(event) => updateStatus(event.target.value, data?.data?.id)}
              >

                {["Pending", "Complete"].map((item) => <option key={item} value={item.toLocaleLowerCase()}>{item}</option>)}
              </Select>
            </span>

          </div>

          <div className='py-2 flex'>
            <span className=' font-semibold pr-2'>
              Appointment Created:
            </span>
            {moment(data?.data?.createdAt).format('DD-MM-YYYY')}
          </div>

        </ModalBody>

        <ModalFooter>
          <Button colorScheme={role === 'admin' ? 'blue' : 'red'} mr={3} onClick={handleClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </div>
  );
};

export default AppointmentDetails;