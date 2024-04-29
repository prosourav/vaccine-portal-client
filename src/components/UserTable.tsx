import { notSortableUserItems, tableDataRange } from '@/constants/appointment';
import { UsersPropType, rowDataType, userTablePropType } from '@/types/appointment';
import { TriangleUpIcon, TriangleDownIcon, ArrowBackIcon, ArrowForwardIcon } from '@chakra-ui/icons';
import { Menu, MenuButton, MenuList, MenuItem, Select, Icon } from '@chakra-ui/react';
import { ColumnSort, createColumnHelper, flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import React, { SetStateAction, useCallback, useEffect, useState } from 'react';
import InfiniteScroll from 'react-infinite-scroll-component';
import Loader from "../../public/assets/loader.gif";
import Image from 'next/image';
import { capitalizeFirstLetter } from '@/utils/convertToCap';
import { menus } from '@/constants/user';


const columnHelper = createColumnHelper<UsersPropType>()

  const UserTable = ({ data, setPagination, pagination, modalVisible, setModalVisible, links, setCurrentItem,  isLoading, next, isError, isSuccess }: userTablePropType) => {
  const [sorting, setSorting] = useState<ColumnSort[]>([]);
  const columns = React.useMemo(
    () => [
      columnHelper.accessor('id', { //accessorKey
        cell: info => `#${info?.getValue().substring(info.getValue()?.length - 14)}`,
        header: () => <span>User Id</span>
      }),
      columnHelper.accessor(row => row.name, {
        id: 'name',
        cell: info => info.getValue(),
        header: () => <span>Name</span>,
      }),
      columnHelper.accessor(row => row.email, {
        id: 'email',
        cell: info => info.getValue(),
        header: () => <span>Email</span>,
      }),
      columnHelper.accessor(row => row.status, {
        id: 'status',
        cell: info => <p className={`${info.getValue()=='pending' ? 'text-blue-500' : info.getValue()=='approved' ? 'text-green-500' : 'text-red-600' }`}> {capitalizeFirstLetter(info.getValue())}</p>,
        header: () => <span className='mx-5'>Status</span>,
      }),
      columnHelper.accessor(row => row.vaccines, {
        id: 'vaccine',
        cell: info => info.getValue()?.length,
        header: () => <span className='pl-2'>Vaccine</span>,
      }),
      columnHelper.accessor(row => row.role, {
        id: 'role',
        cell: info => <div className='flex ml-8 justify-between align-center'>
          <p className={(info.getValue() !== 'user') ? 'text-green-500 pt-1 ml-20' : ' pt-1 ml-20 '}>{capitalizeFirstLetter(info.getValue())}</p>
             <Menu>
                <MenuButton className='mb-2'>
                  <span className='font-semibold mr-4 '>...</span>
                </MenuButton>

                <MenuList>
                  {/* <MenuItem onClick={() => handleView(info.row.original)}> View </MenuItem>

                  <MenuItem onClick={() => handleEdit(info.row.original)}> Edit </MenuItem>

                  <MenuItem onClick={() => handleDelete(info.row.original)}>Delete</MenuItem> */}

                  {
                    menus.map((item: string) => <MenuItem onClick={() => handleOperation(item, info.row.original)}>{item}</MenuItem>)
                  }

                </MenuList>
             </Menu>
        </div>,
        header: () => <span className='ml-2'>Role</span>,
      }),
    ],
    []
  );

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    manualSorting: true,
    state: {
      sorting
    },
    onSortingChange: setSorting,
  });

  const handleSortChange = useCallback(() => {
    setPagination((prv) => ({ ...prv, page: 1, sort_by: sorting[0]?.id, sort_type: sorting[0]?.desc ? 'dsc' : 'asc' }));
  }, [sorting, setPagination]);

  useEffect(() => {
    if (!notSortableUserItems.includes(sorting[0]?.id)) {
      handleSortChange()
    }
  }, [handleSortChange, sorting]);


  const handleView = (data: UsersPropType) => {
    setCurrentItem(data.id as SetStateAction<string>);
    setModalVisible((prv) => ({ ...prv, ["view"]: true }));
  };

  const handleDelete = (data: UsersPropType) => {
    setCurrentItem(data.id as SetStateAction<string>);
    setModalVisible((prv) => ({ ...prv, ["delete"]: true }));
  };

  const handleEdit = (data: UsersPropType) => {
    setCurrentItem(data.id as SetStateAction<string>);
    setModalVisible((prv) => ({ ...prv, ["edit"]: true }));
  };

  const changeAdmin = (data: UsersPropType) =>{
    setCurrentItem(data.id as SetStateAction<string>);
    setModalVisible((prv) => ({ ...prv, ["role"]: true }));
  };

  const handleOperation = (op: string, id: UsersPropType) => {
    switch (op.toLocaleLowerCase()) {
      case "delete": handleDelete(id);break;
      case "view": handleView(id);break;
      case "edit": handleEdit(id);break;
      case "make admin": changeAdmin(id); break;
      default: return ; // or do something else if none of the cases match
    }
  };
  

  return (
    <div>
      <div id="scrollableDiv"  style={{ overflowY: `${data?.length > 10 ? 'scroll' : 'hidden'}`, height: `520px`, background: 'white'  }}>
        <InfiniteScroll
          dataLength={data?.length}
          next={() => setPagination(prv => ({ ...prv, page: prv.page as string + 1 }))}
          hasMore={!!next} // Replace with a condition based on your data source
          loader={data?.length > 10  && <Image src={Loader} alt='' height={80} width={120} className='text-center mx-auto'/>}
          endMessage={data?.length > 10 && !isLoading && <p className='text-center mx-auto bg-green-500 py-4 font-bold text-white'>No more data to load</p>}
          scrollableTarget="scrollableDiv"
        >
          <table className='w-full border-x-neutral-100 border ' >
            <thead className='bg-slate-100 z-10 '>
              {table?.getHeaderGroups().map(headerGroup => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header, idx) => (
                    <th key={idx} className={`${!notSortableUserItems.includes(header.column.id) && 'cursor-pointer '} py-2 pr-2`} onClick={header.column.getToggleSortingHandler()}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )
                      }

                      {!notSortableUserItems.includes(header.column.id) && (
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
              {!!data?.length ?
               table.getRowModel().rows.map(row => (
                <tr key={row.id} className=' h-10 py-3 border border-gray-200'>
                  {row.getVisibleCells().map((cell, idx) => (
                    <td key={idx} className='text-center'>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </td>
                  ))}
                </tr>
              )) :  <tr>
              <td colSpan={columns.length}>
                {isLoading && <p className='text-center font-bold my-10'>Loading...'</p>} 
              </td>
            </tr>
              }
            </tbody>

          </table>
        </InfiniteScroll>
      </div>
    </div>
  );
};

export default UserTable;