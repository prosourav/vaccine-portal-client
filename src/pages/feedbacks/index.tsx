import { defaultPagination } from '@/constants/appointment';
import useFetch from '@/hooks/useFetch';
import { IRootState } from '@/redux/store';
import reviewService from '@/services/reviewService';
import next from 'next'
import Image from 'next/image'
import React, { useCallback, useState } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'
import { useSelector } from 'react-redux';

export default function FeedBackPage() {
  const [pagination, setPagination] = useState({ ...defaultPagination });
  const { operation } = useSelector((state: IRootState) => state.appointmentStore);
  
  const getAllreview = useCallback(() => {
    const query = `${pagination.page ? `?page=${pagination.page}` : ''}${pagination.limit ? `&limit=${pagination.limit}`
      : ''}${pagination.sort_by ? `&sort_by=${pagination.sort_by}`
        : ''}${pagination.sort_type ? `&sort_type=${pagination.sort_type}`
          : ''}${pagination.search ? `&search=${pagination.search}` : ''}${pagination.status == 'all' ? '' : `&status=${pagination.status}`}`;

    return reviewService.getReviews(query);
  }, [pagination.page, pagination.limit, pagination.sort_by, pagination.sort_type, pagination.search, pagination.status, operation]);

  const { data, error, isLoading, isError, isSuccess } =
    useFetch(getAllreview);

    
  return (
    <div>
      <InfiniteScroll
          dataLength={12}
          // next={() => setPagination(prv => ({ ...prv, page: prv.page as string + 1 }))}
          next={() => console.log("Hello!")}
          hasMore={!!next} // Replace with a condition based on your data source
         loader="loading..."
          // loader={data?.length > 10  && <Image src={Loader} alt='' height={80} width={120} className='text-center mx-auto'/>}
          endMessage={data?.length > 10 && !isLoading && <p className='text-center mx-auto bg-green-500 py-4 font-bold text-white'>No more data to load</p>}
          scrollableTarget="scrollableDiv"
        >
        FeedBackPage
        </InfiniteScroll>
      </div>
  )
};
