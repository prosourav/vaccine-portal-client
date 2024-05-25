import { defaultPhoto, initialDisable } from '@/constants/profile';
import useFetch from '@/hooks/useFetch';
import { IRootState } from '@/redux/store';
import { setUserState } from '@/redux/userSlice';
import imageService from '@/services/imageService';
import profileService from '@/services/profileService';
import { ImageType } from '@/types/Profile';
import { UserTypeSubmit } from '@/types/user';
import { VaccineType } from '@/types/vaccine';
import { EditIcon } from '@chakra-ui/icons';
import { Button, Input, useToast } from '@chakra-ui/react';
import { saveAs } from 'file-saver';
import Image from 'next/image';
import React, { useCallback, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';


interface PreSignedUrl {
  url: string;
  // Add other properties if necessary
}

const Profile: React.FC = () => {
  const [isDisable, setIsDisable] = useState({...initialDisable});
  const [payload, setPayload] = useState({photo:'', email:''});
  const [image, setImage] = useState({} as ImageType);
  const [hovered, setHovered] = useState(false);
  const toast = useToast();
  const user = useSelector((state:IRootState)=> state.userStore.mainUser);
  const dispatch = useDispatch();

  // setting ProfileData as Payload
  const getProfile = useCallback(() => {
    return profileService.getProfile();
  }, []);

  const { data, error, isLoading, isError, isSuccess } = useFetch(getProfile);
  useEffect(() => setPayload((prv)=> ({...prv, ["photo"]:data?.data?.photo, ['email']: data?.data?.email})),[data?.data]);

// Photo change
  const handleFileChange = (e: any) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      setPayload((prv) => ({...prv, photo: reader?.result as string}));
      setImage(prv=>({...prv, type:e.target.files[0].type, file :e.target.files[0]}))
    };
    reader.readAsDataURL(e.target.files[0]);
  };

  // getting presigned url
  const getPresignedUrl = useCallback(() => {
    if(image.type) return imageService.getImageUrl(image.type);
    return Promise.resolve(null);
  }, [image.type]);

  const { data: preSignedUrl } = useFetch(getPresignedUrl);
  useEffect(() => { preSignedUrl && setImage({...image, url : (preSignedUrl as PreSignedUrl)?.url.split('?')[0]})},[preSignedUrl]);


// onchange validation and enable disable input
  useEffect(()=>{
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValidEmail = emailPattern.test(payload.email);

    if(isValidEmail && data?.data?.email !== payload.email || image.file) {
     return setIsDisable(prv=>({...prv, ['button']:false}));
    };
    return setIsDisable(prv=>({...prv, ['button']:true}));
  },[payload?.email, payload?.photo]);

// onchange email 
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if(e.target.value) {
    setPayload((prv)=>({...prv, email: e.target.value}));
    }
  };

  const handleSubmit = async() => {

    try {
      let submitPayload = {...payload};

      if(image.file){
        await imageService.uploadImage(image);
        submitPayload = {...payload, photo: image.url};
         const updatedUser = {...user, photo:image.url };
        dispatch(setUserState(updatedUser));
      };

     const response =  await profileService.patchProfile(submitPayload as UserTypeSubmit);
     setIsDisable({...initialDisable});
     
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
    };
  };

  const handleDownload = async () => {
   try {
    const response = await profileService.generatePdf(data.data);

    // Create a blob from the response data
    const blob = new Blob([response], { type: 'application/pdf' });

    // Create a URL for the blob
    const url = window.URL.createObjectURL(blob);

    // Create a link element and trigger download
    const a = document.createElement('a');
    a.href = url;
    a.download = 'certificate.pdf';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    // Revoke the URL object to free up memory
    window.URL.revokeObjectURL(url);
   } catch (error) {
    console.log(error);
   }
  }

  // JSX part

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error fetching profile data</div>;
  };
  

  return (
    <div className="container mx-auto py-8 bg-slate-50">
      <div className="max-w-6xl mx-auto bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-8">
          <h1 className="text-3xl font-bold mb-4 pl-20 ">My Profile</h1>
          <div className='flex justify-center'>

    <div className='px-10'>
      <label htmlFor="fileInput">
        <div
          className="relative w-50 h-50 " 
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <div className={`${ hovered && "absolute cursor-pointer rounded-full inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50"}`}>
            <p className={`text-white  font-bold ${hovered ? '' : 'hidden'}`}>Change</p>
          </div>
          <Image
            width={460}
            height={460}
            className="cursor-pointer rounded-full h-60 w-60 object-cover"
            src={payload?.photo || defaultPhoto}
            alt="logo"
          />
        </div>
      </label>
      <input
        type='file'
        id="fileInput"
        style={{ display: 'none' }}
        onChange={handleFileChange}
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

          <div className='flex justify-end'>

          <Button className='float-right mb-8 mr-2' colorScheme={'blue'} onClick={handleDownload}>
            Download Certificate
          </Button> 

          <Button className='float-right mb-8' colorScheme={'green'}
           isDisabled={isDisable?.button} onClick={handleSubmit}>
            Update
          </Button> 
          </div>
  

        </div>
      </div>
    </div>
  );
};

export default Profile;

