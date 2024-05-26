// import { defaultPagination } from '@/constants/appointment';
import useFetch from '@/hooks/useFetch';
import { IRootState } from '@/redux/store';
import reviewService from '@/services/reviewService';
import next from 'next'
import Image from 'next/image'
import React, { useCallback, useEffect, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useSelector } from 'react-redux';
import vaccineImage from "./../../../public/assets/images.png";
import ReviewBox from './reviewBox/index.';
import { ReviewType } from '@/types/review';
import { useToast } from '@chakra-ui/react';
import Loader from "../../../public/assets/loader.gif";


export const defaultPagination = {
  limit: '5',
  page: 1,
  totalItems: '',
  totalPage: '',
  sort_type: '',
  sort_by: '',
  search: '',
  status: 'all',
};

export default function FeedBackPage() {
  const [pagination, setPagination] = useState({ ...defaultPagination });
  const { operation } = useSelector((state: IRootState) => state.appointmentStore);
  const toast = useToast();
  const { role } = useSelector((state: IRootState) => state.userStore.mainUser);
  const [updated, setUpdated] = useState(false);
  const [allreviews, setAllreviews] = useState([] as any[]);

  const getAllreview = useCallback(() => {
    const query = `${pagination.page ? `?page=${pagination.page}` : ''}${pagination.limit ? `&limit=${pagination.limit}`
      : ''}${pagination.sort_by ? `&sort_by=${pagination.sort_by}`
        : ''}${pagination.sort_type ? `&sort_type=${pagination.sort_type}`
          : ''}${pagination.search ? `&search=${pagination.search}` : ''}${pagination.status == 'all' ? '' : `&status=${pagination.status}`}`;

    return reviewService.getReviews(query);
  }, [pagination.page, pagination.limit, pagination.sort_by, pagination.sort_type, pagination.search, pagination.status, operation, updated]);

  const { data, error, isLoading, isError, isSuccess } = useFetch(getAllreview);

  useEffect(() => {
    if (data?.reviews.length > 0) {
      const newData = data?.reviews;
      return setAllreviews([...allreviews, ...newData]);
    }
  }, [data]);

  const handleApprove = async (data: string) => {
    const payload = { status: "approved" };
    try {
      const response = await reviewService.editReview(data, payload);
      toast({
        title: response.message,
        position: 'top-right',
        status: 'success',
        isClosable: true,
      });
      setUpdated(prv => !prv);
    } catch (error: any) {
      toast({
        title: error.message,
        position: 'top-right',
        status: 'error',
        isClosable: true,
      });
    }
  };

  const handleReject = async (data: string) => {
    try {
      await reviewService.deleteReview(data);
      toast({
        title: 'Review deleted successfully',
        position: 'top-right',
        status: 'success',
        isClosable: true,
      });
      setUpdated(prv => !prv);
    } catch (error: any) {
      toast({
        title: error.message,
        position: 'top-right',
        status: 'error',
        isClosable: true,
      });
    }
  };


  return (
    <div id='scrollableDiv' style={{ overflowY: 'scroll', height: `600px`, background: 'white' }}>
      {!allreviews?.length ? <h1 className='center'>No data found!</h1> :
        <InfiniteScroll
          dataLength={allreviews?.length}
          next={() => setPagination(prv => ({ ...prv, page: prv.page + 1 }))}
          hasMore={!!data?.pagination?.next} // Replace with a condition based on your data source
          loader={data?.reviews?.length > 5 && <Image src={Loader} alt='' height={80} width={120} className='text-center mx-auto' />}
          endMessage={data?.reviews?.length > 5 && !isLoading && <p className='text-center mx-auto bg-green-500 py-4 font-bold text-white'>No more data to load</p>}
          scrollableTarget="scrollableDiv"
        >
          {
            allreviews?.map((item: ReviewType, idx: number) => (
              (role == 'admin' || item.status == 'approved') && <ReviewBox key={idx}
                data={item} image={vaccineImage}
                handleReject={handleReject}
                handleApprove={handleApprove}
              />
            ))
          }
        </InfiniteScroll>}
    </div>
  )
};