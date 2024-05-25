/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react/no-unescaped-entities */
import { Icon, Menu, MenuButton, MenuItem, MenuList, Select } from '@chakra-ui/react'

import {
  ColumnSort,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { AppointmentsPropType, rowDataType, tablePropType } from '@/types/appointment';
import moment from 'moment';
import { notSortableAppointmentItems, tableDataRange } from '@/constants/appointment';
import { TriangleDownIcon, TriangleUpIcon, ArrowBackIcon, ArrowForwardIcon } from '@chakra-ui/icons'
import { useCallback, useEffect, useState } from 'react';
import { IRootState } from '@/redux/store';
import { useSelector } from 'react-redux';
import Loader from "../../public/assets/loader.gif";

const columnHelper = createColumnHelper<AppointmentsPropType>()

const columns = [
  columnHelper.accessor('_id', {
    // header: () => `Id`,
    cell: info => `#${info.getValue().substring(info.getValue()?.length - 14)}`,
    header: () => <span>Appointment Id</span>,
  }),
  columnHelper.accessor(row => row.name, {
    id: 'name',
    cell: info => <h3>{info.getValue()}</h3>,
    header: () => <span>Name</span>,
  }),
  columnHelper.accessor('status', {
    header: () => 'Status',
    cell: info => info.renderValue() == 'pending' ? 'Pending' : "Complete",
  }),
  columnHelper.accessor('vaccine', {
    header: () => <span>Vaccine</span>,
  }),
  columnHelper.accessor('date', {
    header: 'Appointment Date',
    cell: props => <h5 className='mr-2'>{moment(props.renderValue()).format('DD-MM-YYYY')}</h5>
  }),
]

function Table({ data, pagination, setPagination,isLoading, links, setCurrentItem, setModalVisible }: tablePropType) {
  const [sorting, setSorting] = useState<ColumnSort[]>([]);
  const { role } = useSelector((state: IRootState) => state.userStore.mainUser);


  const table = useReactTable({
    data,
    columns,
    // ui sorting
    // getSortedRowModel: getSortedRowModel(),
    getCoreRowModel: getCoreRowModel(),
    state: {
      sorting
    },
    onSortingChange: setSorting,
    manualSorting: true,
  },);

  const handleSortChange = useCallback(() => {
    setPagination((prv) => ({ ...prv, page:'1', sort_by: sorting[0]?.id, sort_type: sorting[0]?.desc ? 'dsc' : 'asc' }));
  }, [sorting, setPagination]);

  useEffect(() => {
    if (!notSortableAppointmentItems.includes(sorting[0]?.id)) {
      handleSortChange()
    }
  }, [sorting]);


  const handleSelectChange = (data: string) => {
    setPagination((prv) => ({ ...prv, ['page']: 1, limit: data }));
  };

  const getPaginationDetails = () => {
    const from = (parseInt(pagination?.page as string) - 1) * parseInt(pagination?.limit) + 1;
    const to = (parseInt(pagination?.page as string) * parseInt(pagination?.limit) > parseInt(pagination?.totalItems) ? parseInt(pagination?.totalItems) : parseInt(pagination?.page as string) * parseInt(pagination?.limit));
    return { from, to };
  };
  
  const isDisabled = (data: rowDataType) => moment(data.date, "YYYY/MM/DD").isBefore(moment()) ? true : false;
 
  const checkDisable = (current: number, total: number) => {
    return current < total ? false : true;
  };
  
  const handleDelete = (data: rowDataType) => {
    setCurrentItem(data._id);
    setModalVisible((prv) => ({ ...prv, ["delete"]: true }));
  };

  const handleUpdate = (data: rowDataType) => {
    setCurrentItem(data._id);
    setModalVisible((prv) => ({ ...prv, ["view"]: true }));
  };

  const handleEdit = (data: rowDataType) => {
    setCurrentItem(data._id);
    setModalVisible((prv) => ({ ...prv, ["edit"]: true }));
  };

  const handleReview = (data: rowDataType) => {
    setCurrentItem(data._id);
    setModalVisible((prv) => ({ ...prv, ["review"]: true }));
  };

  // if(!data){
  //   return <p>Loading...</p>
  // }

  return (
    <div>
    
      <table className={` w-full border-x-neutral-100 border`}>
        <thead className={`p-5 `}>
          {table.getHeaderGroups().map(headerGroup => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header, idx) => (
                <th key={idx} className={`${!notSortableAppointmentItems.includes(header.column.id) && 'cursor-pointer'} py-2 `} onClick={header.column.getToggleSortingHandler()}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )
                  }

                  {!notSortableAppointmentItems.includes(header.column.id) && (
                    header.column.getIsSorted() && (
                      header.column.getIsSorted() === "asc" ?
                        <TriangleUpIcon w={3} h={3} /> :
                        <TriangleDownIcon w={3} h={3} />
                    )
                  )}

                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody className='bg-white'>
          {!!data?.length ? table?.getRowModel().rows.map(row => (
            <tr key={row.id} className=' h-10 py-2 border border-gray-200'>
              {row.getVisibleCells().map((cell, idx) => (
                <td key={idx} className='text-center'>
                  {flexRender(cell.column.columnDef.cell, cell.getContext())}
                </td>
              ))}
              <Menu>
                <MenuButton className='my-1'>
                  <span className='font-semibold'>...</span>
                </MenuButton>

                <MenuList>
                  <MenuItem onClick={() => handleUpdate(row.original)}> View </MenuItem>

                  {role === 'admin' && <MenuItem onClick={() => handleEdit(row.original)}> Edit </MenuItem>}

                  {['user', 'admin'].includes(role) && <MenuItem isDisabled={row.original.status === 'complete' || isDisabled(row.original)} onClick={() => handleDelete(row.original)}>Delete</MenuItem>}

                  {role === 'user' && <MenuItem onClick={()=>handleReview(row.original)} isDisabled={row.original.status === 'pending'}>Add Review</MenuItem>}

                </MenuList>
              </Menu>
            </tr>
          )) : 
          (
            <tr>
              <td colSpan={columns.length}>
               <p className='text-center font-bold my-10'>{ isLoading ? 'Loading...' : 'Sorry you have no data!'}</p>
              </td>
            </tr>
          )
          }
        </tbody>

      </table>
      <div className='flex items-center py-1'>
        <div className='ml-auto w-12/12 flex'>
          <div className='flex h-12 justify-center align-middle px-2'>

            <p className='mr-5 self-center font-medium'>Row Per page</p>
            <div className='mr-5 self-center'>
              <Select value={pagination?.limit} onChange={(event) => handleSelectChange(event.target.value)}>
                {tableDataRange.map((row, idx) => <option
                  // disabled={checkDisable(getPaginationDetails().to, parseInt(pagination?.totalItems))
                  //   && (row > parseInt(pagination?.totalItems))}
                  key={idx} value={row}>{row}</option>)}
              </Select>
            </div>
          </div>

          <div className='ml-auto flex pr-2'>
            <p className='mr-5 self-center font-medium'>{getPaginationDetails().from} - {getPaginationDetails().to} of {pagination?.totalItems}</p>
            <button
              onClick={() => setPagination((prv) => ({ ...prv, page: '1' }))}
              className='px-1'
            >
              First Page
              {/* <Icon as={ArrowLeftIcon} /> */}
            </button>
            <button
              className='px-1'
              disabled={!links?.prev}
              onClick={() => setPagination((prv) => ({ ...prv, page: (parseInt(pagination?.page as string) - 1).toString() }))}
            >
              <Icon as={ArrowBackIcon} />
              {/* ArrowBackIcon */}
            </button>

            <button disabled={!links?.next}
              className='px-1'
              onClick={() => setPagination((prv) => ({ ...prv, page: (parseInt(pagination?.page as string) + 1).toString() }))}
            >
              <Icon as={ArrowForwardIcon} />
            </button>
            <button
              className='px-1'
              disabled={!links?.next}
              onClick={() => setPagination((prv) => ({ ...prv, page: pagination?.totalPage }))}
            >
              Last Page
            </button>

          </div>
        </div>
      </div>

    </div>
  )
}
export default Table;