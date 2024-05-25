import useFetch from '@/hooks/useFetch';
import userService from '@/services/userService';
import React, { useCallback, useEffect, useRef, useState } from 'react'
import Image from 'next/image';
import InfiniteScroll from 'react-infinite-scroll-component';
import Loader from "../../../../public/assets/loader.gif";
import { defaultPagination } from '@/constants/Chat';
import { ChatUsersPropType, ChatUsersType,  PaginationType } from '@/types/Chat';
import { Input, InputGroup, InputRightElement } from '@chakra-ui/react';
import { SearchIcon } from '@chakra-ui/icons';
import { useSelector } from 'react-redux';
import { IRootState } from '@/redux/store';
import { findOnlineStatus } from '@/utils/onlineStatus';



export default function ChatUsers({ setChatWith }: ChatUsersPropType ) {
    const [pagination, setPagination] = useState<PaginationType>({ ...defaultPagination } as PaginationType);
    const [users, setusers] = useState<ChatUsersType[]>([]);
    const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
    const { online } = useSelector((state: IRootState) => state.chatStore);
    const { email } = useSelector((state: IRootState) => state.userStore.mainUser);


    const getAllUsers = useCallback(() => {
        const query = `${pagination.page ? `?page=${pagination.page}` : ''}${pagination.limit ? `&limit=${pagination.limit}`
          : ''}${pagination.sort_by ? `&sort_by=${pagination.sort_by}`
            : ''}${pagination.sort_type ? `&sort_type=${pagination.sort_type}`
              : ''}${pagination.search ? `&search=${pagination.search}` : ''}${pagination.status == 'all' ? '' : `&status=${pagination.status}`}`;
    
        return userService.getUsers(query);
      }, [pagination.page, pagination.limit, pagination.sort_by, pagination.sort_type, pagination.search, pagination.status]);

    
    const { data, error, isLoading, isError, isSuccess } = useFetch(getAllUsers);


    useEffect(() => {
        if (pagination.page == 1) {
          const result = findOnlineStatus(data?.data, online, email);
            return setusers(result);
        };

        if (data?.data?.length && Array.isArray(data?.data)) {
          let onlineUsers = [...users, ...data?.data];
          onlineUsers = findOnlineStatus(onlineUsers, online, email);
          return setusers(onlineUsers);
        };
      }, [data?.data,online]);

    // console.log(users);
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

      const handleSetConverSation = (e: ChatUsersType) => setChatWith(e);


    return (
        <div style={{width:'20%', backgroundColor:'#f5f5f5',}}>
        <p className=' font-extrabold text-center text-lg my-6 bg-gray-100'>All Users</p>

            <InputGroup size='md' className='my-1'>
                <Input
                  pr='4.5rem'
                  type={'text'}
                  placeholder='Search'
                  onChange={onChangeSearch}
                />
                <InputRightElement className='px-5'>
                   <SearchIcon />  
                </InputRightElement>
            </InputGroup>

        <div id="scrollableDiv" style={{display:'flex', height:'76vh', flexDirection:'column',  overflowY:'scroll'}}>
         <InfiniteScroll
          dataLength={users?.length}
          next={() => setPagination(prv => ({ ...prv, page: prv.page as number + 1}))}
          hasMore={!!data?.pagination?.next} // Replace with a condition based on your data source
          loader= {<Image src={Loader} alt='Loading...' height={80} width={120} className='text-center mx-auto'/>}
          endMessage={users?.length > 10 && !isLoading && <p className='text-center mx-auto bg-green-500 py-4 font-bold text-white'>No more data to load</p>}
          scrollableTarget="scrollableDiv"
        >
          {isLoading && <Image src={Loader} alt='Loading...' height={80} width={120} className='text-center mx-auto'/>}
          {
          !!users?.length && users?.map((user: ChatUsersType) => {
             return  <div className=' hover:bg-sky-700  ' key={user?.email} style={{height:'40px',  display:'flex', alignItems:'center', padding:'12%', cursor:'pointer', margin:'1px 0px', background:'#FFF' }}
             onClick={()=>handleSetConverSation(user)}>
                           <div style={{ width: "10px", marginRight:'3px', border: user.online ? "1px solid green" : "1px solid red", height: '9px', backgroundColor: user.online ? "green" : "red", borderColor: user.online ? "green" : "red", borderRadius: '50%' }}>
                           </div>
                           <Image
                           width={10}
                           height={10}
                           className="rounded-full h-10 w-10 object-cover"
                           src="https://tuk-cdn.s3.amazonaws.com/assets/components/horizontal_navigation/hn_2.png"
                           alt="logo"
                         />
                           <div className='text-center font-bold pl-1'>
                             {user?.name} 
                           </div>
                     </div>
           })
          }
          {
            isError && <p className='text-center'>Something went Wrong!</p>
          }

        </InfiniteScroll>
         </div>
       </div>
  )
}
