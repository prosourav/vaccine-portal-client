import { ReactNode, SetStateAction } from "react";

export interface Event {
  title: string;
  start: Date;
  end: Date;
};

export interface AppointmentType {
  vaccine: string;
  date: string
};

export interface propsType {
  selectedDate: string;
  handleSubmit: () => void;
  setFormData: (data: SetStateAction<AppointmentType>) => void;
  formData: AppointmentType
};

export interface AppointmentsPropType {
  _id: string,
  name: string,
  status: string,
  vaccine: string,
  link: string,
  date: string
};

export interface UsersPropType {
  _id?: string,
  id: string,
  name: string,
  status: string,
  email: string,
  role: string,
  vaccines: string[]
};

export interface paginationType {
  limit: string,
  page: string|number,
  totalItems: string,
  totalPage: string
  sort_type: string,
  sort_by: string,
  search?: string,
  name?: string
  status: string
  next?: number,
  prev?:number,
}

export interface tablePropType {
  data: AppointmentsPropType[],
  pagination: paginationType,
  links: {
    self: string,
    prev?: string
    next?: string
  }
  isLoading: boolean;
  setCurrentItem:  (data: SetStateAction<string>) => void;
  setPagination: (data: SetStateAction<paginationType>) => void;
  modalVisible: { view: boolean; delete: boolean; edit: boolean, create: boolean, role: boolean};
  setModalVisible: (data: SetStateAction<{ view: boolean; delete: boolean; edit: boolean; create: boolean, role: boolean, review:boolean }>) => void;
};
export interface userTablePropType {
  data: UsersPropType[],
  pagination?: paginationType,
  links: {
    self: string,
    prev?: string
    next?: string
  }
  setCurrentItem:  (data: SetStateAction<string>) => void;
  isLoading: boolean
  setPagination: (data: SetStateAction<paginationType>) => void;
  modalVisible: { view: boolean; delete: boolean; edit: boolean, create: boolean; role: boolean, review:boolean };
  setModalVisible: (data: SetStateAction<{ view: boolean; delete: boolean; edit: boolean; create: boolean, role: boolean, review:boolean }>) => void;
  next?: number
  isSuccess:boolean;
  isError:boolean
};

export interface rowDataType {
  _id: string,
  name: string,
  status: string,
  vaccine: string,
  link: string,
  date: string,
}

export interface ChildComponentProps {
  setModalVisible: (data: SetStateAction<{ view: boolean; delete: boolean; edit: boolean; create: boolean, role:boolean, review: boolean }>) => void;
  currentItem: string
}