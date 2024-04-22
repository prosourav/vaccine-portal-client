import Custom404 from '@/components/404';
import { ChakraModal } from '@/components/ChakraModal';
import CreateVaccine from '@/components/CreateVaccine';
import UserDetails from '@/components/UserDetails';
import VaccineTable from '@/components/VaccineTable';
import { vaccineStatus, vaccineOptions, defaultPagination } from '@/constants/vaccines';
import useFetch from '@/hooks/useFetch';
import { IRootState } from '@/redux/store';
import vaccineService from '@/services/vaccineService';
import { paginationType } from '@/types/appointment';
import { VaccineType } from '@/types/vaccine';
import { SearchIcon } from '@chakra-ui/icons';
import { Button, Input, InputGroup, InputRightElement, Select, Text } from '@chakra-ui/react';
import React, { SetStateAction, useCallback, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';


const VaccineListing = () => {
  const [pagination, setPagination] = useState({ ...defaultPagination });
  const [modalVisible, setModalVisible] = useState(false);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { role } = useSelector((state: IRootState) => state.userStore.mainUser);
  const [tableData, setTableData] = useState([] as VaccineType[]);
  const [currentItem, setCurrentItem] = useState('');

  const { operation } = useSelector((state: IRootState) => state.appointmentStore);

  const getAllVaccines = useCallback(() => {
    const query = `${pagination.page ? `?page=${pagination.page}` : ''}${pagination.limit ? `&limit=${pagination.limit}`
      : ''}${pagination.sort_by ? `&sort_by=${pagination.sort_by}`
        : ''}${pagination.sort_type ? `&sort_type=${pagination.sort_type}`
          : ''}${pagination.name == 'all' ? '' : `&name=${pagination.name}`}${pagination.status == 'all' ? '' : `&status=${pagination.status}`}`;

    return vaccineService.getVaccines(query);
  }, [pagination.page, pagination.limit, pagination.sort_by, pagination.sort_type, pagination.name, pagination.status, operation]);

  const { data, error, isLoading, isError, isSuccess } =
    useFetch(getAllVaccines);

  useEffect(() => {
    if (pagination.page == 1) {
      setTableData(data?.data);
    } else if (data?.data.length && Array.isArray(data?.data)) {
      const oldData = tableData;
      const newData = data?.data;
      const updatedData = oldData.concat(newData);
      setTableData(updatedData);
    }
  }, [data?.data]);



const handleCreateModal = () =>{
  setModalVisible(true);
};


  if (role == 'user') {
    return <Custom404 />;
  }

  return (
    <>

  <ChakraModal
        isOpen={modalVisible}
        onClose={() => {
          setModalVisible(false);
        }}
      >
        <CreateVaccine {...{ currentItem, setModalVisible }} />
      </ChakraModal> 

    <div className=' mx-auto my-12 w-11/12 rounded-lg'>
      <div className='flex justify-between items-center mb-1 px-4 bg-white'>
        <Text as='b' className='p-4'>All Vaccine</Text>
        <div className='flex w-2/3 '>

          <div className='w-2/6 ml-32'>
            <Select onChange={({ target }) => setPagination(prv => ({ ...prv, page:1, status: target.value as 'all' }))}>
            <option value={'all'} >Vaccine</option>
              {vaccineStatus.map((item, id) => (
                <option value={item.toLowerCase()} key={id}>{item}</option>))}
            </Select>

          </div>

          <div className='w-2/6 ml-10'>
            <Select onChange={({ target }) => setPagination(prv => ({ ...prv, page:1, name: target.value as 'all' }))}>
          <option value={'all'} >Status</option>
              
              {vaccineOptions.map((item, id) => (
                <option value={item.toLowerCase()} key={id}>{item}</option>))}
            </Select>

          </div>
          <div className='w-2/6 ml-2'>
          <Button colorScheme={'green'} ml={6} onClick={handleCreateModal}>
            <span className='font-bold  mb-1 text-lg'>+</span>
            Add New Vaccine
          </Button>
          </div>
        </div>
      </div>

       <VaccineTable
        data={tableData} setPagination={setPagination as (data: SetStateAction<paginationType>) => void}
        modalVisible={modalVisible} setModalVisible={setModalVisible}
        pagination={pagination}
        isError={isError} isSuccess={isSuccess}
        isLoading={isLoading}
        setCurrentItem={setCurrentItem}
        next={data?.pagination?.next}
        links={data?.links} />

    </div>
    </>

  );
};

export default VaccineListing;