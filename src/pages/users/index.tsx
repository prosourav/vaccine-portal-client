import Custom404 from '@/components/404';
import { ChakraModal } from '@/components/ChakraModal';
import ChangeAdmin from '@/components/ChangeAdminConfirm';
import CreateUser from '@/components/CreateUser';
import DeleteConfirmation from '@/components/DeleteUser';
import UserDetails from '@/components/UserDetails';
import UserTable from '@/components/UserTable';
import UserEdit from '@/components/UserUpdate';
import { defaultPagination, userStatus } from '@/constants/appointment';
import useFetch from '@/hooks/useFetch';
import { IRootState } from '@/redux/store';
import userService from '@/services/userService';
import { UsersPropType, paginationType } from '@/types/appointment';
import { SearchIcon } from '@chakra-ui/icons';
import { Button, Input, InputGroup, InputRightElement, Select, Text } from '@chakra-ui/react';
import React, { SetStateAction, useCallback, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';


const UserListing = () => {
  const [pagination, setPagination] = useState({ ...defaultPagination });
  const [modalVisible, setModalVisible] = useState({ view: false, delete: false, edit: false, create: false, role: false, review: false });
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { role } = useSelector((state: IRootState) => state.userStore.mainUser);
  const [tableData, setTableData] = useState([] as UsersPropType[]);
  const [currentItem, setCurrentItem] = useState('');

  const { operation } = useSelector((state: IRootState) => state.appointmentStore);


  const getAllUsers = useCallback(() => {
    const query = `${pagination.page ? `?page=${pagination.page}` : ''}${pagination.limit ? `&limit=${pagination.limit}`
      : ''}${pagination.sort_by ? `&sort_by=${pagination.sort_by}`
        : ''}${pagination.sort_type ? `&sort_type=${pagination.sort_type}`
          : ''}${pagination.search ? `&search=${pagination.search}` : ''}${pagination.status == 'all' ? '' : `&status=${pagination.status}`}`;

    return userService.getUsers(query);
  }, [pagination.page, pagination.limit, pagination.sort_by, pagination.sort_type, pagination.search, pagination.status, operation]);

  const { data, error, isLoading, isError, isSuccess } =
    useFetch(getAllUsers);

  useEffect(() => {
    if (pagination.page == 1) {
      setTableData(data?.data);
    } else if (data?.data?.length && Array.isArray(data?.data)) {
      const oldData = tableData;
      const newData = data?.data;
      const updatedData = oldData.concat(newData);
      setTableData(updatedData);
    }
  }, [data?.data]);


  const onChangeSearch = useCallback((e: React.ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value.trim();

    // Clear any previous timeout
    if (debounceTimeoutRef.current !== null) {
      clearTimeout(debounceTimeoutRef.current);
    }

    // Set a new timeout to debounce the search
    debounceTimeoutRef.current = setTimeout(() => {
      setPagination((prev) => ({ ...prev, page: 1, search: value as '' }));
    }, 400);
  }, []);

  const handleCreateModal = () => {
    setModalVisible((prv) => ({ ...prv, create: true }));
  };


  if (role == 'user') {
    return <Custom404 />;
  }

  return (
    <>
      <ChakraModal
        isOpen={modalVisible.view}
        onClose={() => {
          setModalVisible(prv => ({ ...prv, ['view']: false }));
        }}
      >
        <UserDetails {...{ currentItem, setModalVisible }} />
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
        <UserEdit {...{ currentItem, setModalVisible }} />

      </ChakraModal>

       <ChakraModal
        isOpen={modalVisible.create}
        onClose={() => {
          setModalVisible(prv => ({ ...prv, ['create']: false }));
        }}
      >
        <CreateUser {...{ currentItem, setModalVisible }} />
      </ChakraModal> 

      <ChakraModal
        isOpen={modalVisible.role}
        onClose={() => {
          setModalVisible(prv => ({ ...prv, ['role']: false }));
        }}
      >
        <ChangeAdmin {...{ currentItem, setModalVisible }} />
      </ChakraModal> 

    <div className=' mx-auto my-6 w-11/12 rounded-lg'>
      <div className='flex justify-between items-center mb-1 px-4 bg-white'>
        <Text as='b' className='p-4'>All Users</Text>
        <div className='flex w-2/3'>
          <InputGroup className='mr-4'>
            <Input onChange={onChangeSearch} type="text" placeholder="Search" />

            <InputRightElement
              pointerEvents="none"
            >
              <SearchIcon color="gray.300" />
            </InputRightElement>
          </InputGroup>

          <div className='w-2/6'>
            <Select onChange={({ target }) => setPagination(prv => ({ ...prv, page:1, status: target.value as 'all' }))}>
              {userStatus.map((item, id) => (
                <option value={item.toLowerCase()} key={id}>{item}</option>))}

            </Select>
          </div>
          <div className='w-2/6'>
          <Button colorScheme={'green'} ml={6} onClick={handleCreateModal}>
            <span className='font-bold  mb-1 text-lg'>+</span>
            Add New User
          </Button>
          </div>
        </div>
      </div>

      <UserTable
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

export default UserListing;