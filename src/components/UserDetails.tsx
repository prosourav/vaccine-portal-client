import appointmentService from '@/services/appointmentService';
import { Button, ModalBody, ModalCloseButton, ModalContent, ModalFooter, ModalHeader, Select, Tag, TagLabel } from '@chakra-ui/react';
import React, { ReactNode, SetStateAction, useCallback, useEffect, useState } from 'react';
import { useToast } from "@chakra-ui/react";
import { setAppointmentState } from '@/redux/appointmentSlice';
import { useDispatch, useSelector } from 'react-redux';
import { ChildComponentProps } from '@/types/appointment';
import useFetch from '@/hooks/useFetch';
import moment from 'moment';
import { IRootState } from '@/redux/store';
import userService from '@/services/userService';
import { capitalizeFirstLetter } from '@/utils/convertToCap';


const UserDetails = ({ setModalVisible, currentItem }: ChildComponentProps) => {
//   const [selected, setSelected] = useState({ vaccine: '', status: '', date: '' });
  const toast = useToast();
  const dispatch = useDispatch();
  const { role } = useSelector((state: IRootState) => state.userStore.mainUser);
  const { availability } = useSelector((state: IRootState) => state.availabilityStore);
  const { operation } = useSelector((state: IRootState) => state.appointmentStore);



  const getUserDetails = useCallback(() => {
    return userService.getSingleUser(currentItem);
  }, [currentItem]);

  const { data, error, isLoading, isError, isSuccess } =
    useFetch(getUserDetails);

//   useEffect(() => { setSelected((prv) => ({ ...prv, ['status']: data?.data?.status, ['vaccine']: data?.data?.vaccine, ['date']: moment(data?.data?.date).format('DD-MM-YYYY') })) }, [data?.data?.date, data?.data?.status, data?.data?.vaccine]);

  // getting called on onChange 
  const handleClose = () => {
    setModalVisible((prv) => ({ ...prv, ['view']: false }));
  };

  return (
    <div>
      <ModalContent>
        <ModalHeader>{capitalizeFirstLetter(data?.data?.role)} Details</ModalHeader>
        <ModalCloseButton />
        <ModalBody>

          <div className='py-2'>
            <span className=' font-semibold pr-2'>
              User Id :
            </span>
            #{(data?.data?.id)}
          </div>

          <div className='py-2'>
            <span className=' font-semibold pr-2'>
              User Name :
            </span>
            {data?.data?.name}
          </div>

          <div className='py-2'>
            <span className=' font-semibold pr-2'>
              User Email :
            </span>
            {data?.data?.email}
          </div>


          <div className='py-2 flex items-center '>
            <span className=' font-semibold pr-2'>
              Status:
            </span>
            <span className='w-30 pl-1'>
            <Tag 
            size={'sm'} 
            key={data?.data?.status} 
            variant='solid' 
            className='mt-1 p-1'
            colorScheme={
                data?.data?.status === 'approved' ? 'green' : 
                data?.data?.status === 'pending' ? 'blue' : 
                'red'
            }
            >
  <TagLabel>{capitalizeFirstLetter(data?.data?.status)}</TagLabel>
</Tag>

                
            </span>

          </div>

          <div className='py-2 flex'>
            <span className=' font-semibold pr-2'>
              Register Date:
            </span>
            {moment(data?.data?.createdAt).format('DD-MM-YYYY')}
          </div>

          <div className='mt-2 flex'>
            <div className=' font-semibold pr-2'>
              Vaccines :
            </div>
            {/* {console.log(data?.data?.vaccines)} */}
            <div className='flex align-middle'>
              {
                !!data?.data?.vaccines.length ? data?.data?.vaccines.map((item: Record<string, string>, idx: number) => (
                  <div className='flex'>
                        <Tag size={'sm'} key={idx} variant='outline' className='mx-1 ' colorScheme='green'>
                             <TagLabel>{capitalizeFirstLetter(item.name)}</TagLabel>  
                        <p className='mx-2'> | {moment(item?.createdAt).format('DD-MM-YYYY')}</p>

                        </Tag>
                  </div>

                )):'N/A'
            }  
          </div>
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

export default UserDetails;