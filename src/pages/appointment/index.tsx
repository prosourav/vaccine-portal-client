/* eslint-disable react-hooks/exhaustive-deps */
import React, { SetStateAction, useCallback, useRef, useState } from 'react';
import AppointmentTable from '../../components/Table';
import useFetch from '@/hooks/useFetch';
import appointmentService from '@/services/appointmentService';
import { defaultPagination, vaccineStatus } from '@/constants/appointment';
import { Input, InputGroup, InputRightElement, Select, Text } from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import { useSelector } from 'react-redux';
import { IRootState } from '@/redux/store';
import { paginationType } from '@/types/appointment';
import AppointmentDetails from '@/components/AppointmentDetails';
import AppointmentEdit from '@/components/AppointmentEdit';
import { ChakraModal } from '@/components/ChakraModal';
import DeleteConfirmation from '@/components/DeleteAppointment';
import CreateReview from '@/components/CreateReview';

const appointmentModalDefault = { view: false, delete: false, edit: false, create: false, role: false, review: false };

const Appointments = () => {
  const [pagination, setPagination] = useState(defaultPagination);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [currentItem, setCurrentItem] = useState('');
  const [modalVisible, setModalVisible] = useState({...appointmentModalDefault});
  const { operation } = useSelector((state: IRootState) => state.appointmentStore);
  const { role } = useSelector((state: IRootState) => state.userStore.mainUser);

  const getAllAppointments = useCallback(() => {
    const query = `${pagination.page ? `?page=${pagination.page}` : ''}${pagination.limit ? `&limit=${pagination.limit}`
      : ''}${pagination.sort_by ? `&sort_by=${pagination.sort_by}`
        : ''}${pagination.sort_type ? `&sort_type=${pagination.sort_type}`
          : ''}${pagination.search ? `&search=${pagination.search}` : ''}${pagination.status == 'all' ? '' : `&status=${pagination.status}`}`;
    return appointmentService.getAllAppointments(query);
  }, [pagination.page, pagination.limit, pagination.sort_by, pagination.sort_type, pagination.search, pagination.status, operation]);

  const { data, error, isLoading, isError, isSuccess } = useFetch(getAllAppointments);

  const onChangeSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value.trim();

    // Clear any previous timeout
    if (debounceTimeoutRef.current !== null) {
      clearTimeout(debounceTimeoutRef.current);
    };

    // Set a new timeout to debounce the search
    debounceTimeoutRef.current = setTimeout(() => {
      setPagination((prev) => ({ ...prev, page:1, search: value as "" }));
    }, 400);
  }, []);


  return (
    <div style={{height:'86vh', overflowY:'auto'}}>
      <ChakraModal
        isOpen={modalVisible.view}
        onClose={() => {
          setModalVisible(prv => ({ ...prv, ['view']: false }));
        }}
      >
        <AppointmentDetails {...{ currentItem, setModalVisible }} />
      </ChakraModal>

      <ChakraModal
        isOpen={modalVisible.delete}
        onClose={() => {
          setModalVisible(prv => ({ ...prv, ['delete']: false }));
        }}

      >
        <DeleteConfirmation {...{ currentItem, setModalVisible }} />
      </ChakraModal>

      <ChakraModal
        isOpen={modalVisible.edit}
        onClose={() => {
          setModalVisible(prv => ({ ...prv, ['edit']: false }));
        }}

      >
        {/* <AppointmentForm selectedDate={formData.date} setFormData={formData}/> */}
        <AppointmentEdit {...{ currentItem, setModalVisible }} />

      </ChakraModal>

      <ChakraModal
        isOpen={modalVisible.review}
        onClose={() => {
          setModalVisible(prv => ({ ...prv, ['review']: false }));
        }}
      >
        <CreateReview {...{ currentItem, setModalVisible }} />
      </ChakraModal>

    <div className=' bg-slate-100 mx-auto my-6 w-11/12 rounded-lg'>
      <div className='flex justify-between items-center mb-1 px-4 bg-white'>
        <Text as='b' className='p-4'>All Appointments</Text>
        <div className='flex w-2/3'>
          <InputGroup className='mr-4'>
            {role === 'admin' && <>
              <Input onChange={onChangeSearch} type="text" placeholder="Search" />

              <InputRightElement
                pointerEvents="none"
              >
                <SearchIcon color="gray.300" /></InputRightElement>
            </>}
          </InputGroup>

          <div className='w-2/6'>
            <Select onChange={({ target }) => setPagination(prv => ({ ...prv, page: 1, status: target.value as "all" }))}>
              {vaccineStatus.map((item, id) => (
                <option value={item.toLowerCase()} key={id}>{item}</option>))}
            </Select>
          </div>
        </div>
      </div>
      <AppointmentTable
        data={data?.data} pagination={data?.pagination}
        setPagination={setPagination as (data: SetStateAction<paginationType>) => void}
        setCurrentItem={setCurrentItem}
        isLoading={isLoading}
        links={data?.links} modalVisible={modalVisible} setModalVisible={setModalVisible} />
    </div>
    </div>

  );
};

export default Appointments;