/* eslint-disable react-hooks/exhaustive-deps */
import useFetch from '@/hooks/useFetch';
import authService from '@/services/authService';
import { Button } from '@chakra-ui/react';
import { AxiosError, AxiosResponse } from 'axios';
import { useRouter } from 'next/router';
import React, { ReactNode, useCallback } from 'react';

const VerifyToken = () => {

  const router = useRouter();
  const { token } = router.query;
  const controller = new AbortController();

  const verifyToken = useCallback(() => {
    if (token) {
      return authService.verify(token as string, { signal: controller.signal });
    }
    return new Promise((_resolve, reject) => { reject() })
  }, [token]);

  const { data, error, isLoading, isError, isSuccess } = useFetch(verifyToken);


  if (isSuccess) {
    return (<div className=' min-h-screen flex'>

      <div className='m-auto flex flex-col'>
        <h4 className='my-2 text-4xl'>Email Successfuly Verified</h4>
        <Button size={'md'} colorScheme='green' onClick={() => router.push('/auth/login')}>Login</Button>
      </div>
    </div>)
  }

  if (isError) {
    return (<div className=' min-h-screen flex'>
      <div className='m-auto flex flex-col align-middle justify-items-center'>
        <h4 className='my-2 text-2xl text-red-700'>{error as ReactNode}</h4>
        <Button className=' w-52 text-center mx-auto' size={'sm'} colorScheme='blue' onClick={() => router.push('/auth/register')}>Register</Button>
      </div>
    </div>)
  }

};

export default VerifyToken;