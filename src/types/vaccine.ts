import { paginationType } from "./appointment"
import { SetStateAction } from "react";


export interface VaccineType{
    _id: string
    name: string
    status: string
    createdAt: string
    updatedAt?: string
    appointment?: string
};

export interface vaccineTablePropType {
    data: VaccineType[],
    pagination?: paginationType,
    links: {
      self: string,
      prev?: string
      next?: string
    }
    setCurrentItem:  (data: SetStateAction<string>) => void;
    isLoading: boolean;
    setPagination: (data: SetStateAction<paginationType>) => void;
    modalVisible: boolean;
    setModalVisible: (data: SetStateAction<boolean>) => void;
    next?: number
    isSuccess:boolean;
    isError:boolean
  };


  export interface ChildComponentProps {
    setModalVisible: (data: SetStateAction<boolean>) => void;
    currentItem: string
  }


 export type VaccinePayloadType = 'Pnemonia' | "Covid" | "Viral" ;
