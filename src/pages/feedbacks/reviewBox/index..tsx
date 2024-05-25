import React from 'react'
import Image, { StaticImageData } from "next/image";
import { ReviewProp, ReviewType } from '@/types/review';
import { Button } from '@chakra-ui/react';
import { IRootState } from '@/redux/store';
import { useSelector } from 'react-redux';
import reviewService from '@/services/reviewService';

export default function ReviewBox({data, image, handleApprove, handleReject}: ReviewProp) {
    const { role } = useSelector((state: IRootState) => state.userStore.mainUser);

  return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            boxShadow: '5px 5px 10px rgba(0, 0, 0, 0.4)',
            padding: '20px', // Adding some padding for better spacing
            borderRadius: '8px', // Adding border radius for rounded corners
            backgroundColor: '#ffffff', // Adding a background color
            maxWidth: '1100px', // Limiting the maximum width
            margin: ' 25px auto' // Centering the box horizontally
        }}>
            <div style={{ textAlign: 'center' }}>
                <Image src={image} height={400} width={400} alt="image" style={{ height: '90px', width: '120px' }} />
                <p className='font-medium text-green-800'>{data.vaccine}</p>
            </div>

            <div style={{ textAlign: 'center', width:'80%'}}>
              <h2 className='font-semibold'>{data.userName} </h2>
            <p>{data.comment}</p> 
            {role=='admin' && data.status=='pending' &&
            <div className=' float-right'>
                <Button className=' w-24' colorScheme={'green'} mr={3} onClick={()=>handleApprove(data.id)}>Approve</Button>
                <Button className=' w-24'  colorScheme={'red'} mr={3} onClick={()=>handleReject(data.id)}>Reject</Button>
            </div>}
        </div>
        </div>

  )
};