import useFetch from '@/hooks/useFetch';
import profileService from '@/services/profileService';
import { UserTypeSubmit } from '@/types/user';
import { VaccineType } from '@/types/vaccine';
import { EditIcon } from '@chakra-ui/icons';
import { Button, Input, useToast } from '@chakra-ui/react';
import Image from 'next/image';
import React, { SetStateAction, useCallback, useEffect, useState } from 'react';


const Profile: React.FC = () => {
  const [isDisable, setIsDisable] = useState({button: true, input: true});
  const [payload, setPayload] = useState({photo:'', email:''});
  const toast = useToast();


  const getProfile = useCallback(() => {
    return profileService.getProfile();
  }, []);

  const { data, error, isLoading, isError, isSuccess } = useFetch(getProfile);

  useEffect(()=>setPayload((prv)=> ({...prv, ['email']: data?.data?.email})),[data?.data]);


  useEffect(()=>{
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValidEmail = emailPattern.test(payload.email);

    if(isValidEmail && data?.data?.email !== payload.email) {
     return setIsDisable(prv=>({...prv, ['button']:false}));
    };
    return setIsDisable(prv=>({...prv, ['button']:true}));
  },[payload.email]);


  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error fetching profile data</div>;
  };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if(e.target.value) {
       setPayload((prv)=>({...prv, email: e.target.value}));
      }
  };

  const handleSubmit = async() => {
    try {
     const response =  await profileService.patchProfile(payload as UserTypeSubmit);
     setIsDisable((prv)=> ({...prv,['input']: true }));
     toast({
      title: response?.message,
      position: 'top-right',
      status: 'success',
      isClosable: true,
    });
    } catch (error: any) {
      toast({
          title: error?.message,
          position: 'top-right',
          status: 'error',
          isClosable: true,
        });
    }finally{
      console.log("Got error");
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-6xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-8">
          <h1 className="text-3xl font-bold mb-4 pl-10">My Profile</h1>
          <div className='flex justify-center'>
            <div className='px-10'>
            <Image
              width={120}
              height={120}
              className="rounded-full h-60 w-60 object-cover"
              src="https://e7.pngegg.com/pngimages/799/987/png-clipart-computer-icons-avatar-icon-design-avatar-heroes-computer-wallpaper.png"
              alt="logo"
            />
            </div>
         
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 ml-auto ">
          
            <div>
              <p className="text-lg font-semibold mb-2">Name</p>
              <p className="text-gray-700">{data?.data?.name}</p>
            </div>
            <div>
              <p className="text-lg font-semibold mb-2">Email</p>
              {/* <p className="text-gray-700">{data?.data?.email}</p> */}
              <Input type='email' defaultValue={payload?.email} width={80} isDisabled={isDisable.input} onChange={handleChange}/>
              <EditIcon className='mx-2 cursor-pointer' w={5} h={5} onClick={()=>setIsDisable(prv=>({...prv, ['input']:!prv.input}))}/>
            </div>
            <div>
              <p className="text-lg font-semibold mb-2">Role</p>
              <p className="text-gray-700">{data?.data?.role}</p>
            </div>
            <div>
              <p className="text-lg font-semibold mb-2">Status</p>
              <p className="text-gray-700">{data?.data?.status}</p>
            </div>
            <div className="col-span-2 pb-10">
              <p className="text-lg font-semibold mb-2">Vaccines</p>
              <ul className="list-disc list-inside ">
                {data?.data?.vaccines.map((vaccine: VaccineType) => (
                  <div key={vaccine._id} className="text-green">
                    {vaccine.name} | {new Date(vaccine?.updatedAt as string).toLocaleString()}
                    <p>AppointmentId: 
                    <span className=' font-bold'>{`#${vaccine?.appointment}`}</span></p>
                  </div>
                ))}
              </ul>
            </div>

          </div>

          </div>
          <Button className='float-right mb-8' colorScheme={'green'} isDisabled={isDisable?.button}
           onClick={handleSubmit}
           >
            Update
          </Button>    
        </div>
      </div>
    </div>
  );
};

export default Profile;
