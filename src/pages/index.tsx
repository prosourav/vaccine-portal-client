/* eslint-disable react-hooks/exhaustive-deps */
import React, { SetStateAction, useEffect, useRef } from "react";
import Calendar from "@/components/Callendar";
import { useCallback, useState } from "react";
import appointmentService from "@/services/appointmentService";
import useFetch from "@/hooks/useFetch";
import Modal from "@/components/Modal";
import AppointmentForm from "@/components/AppointmentForm";
import { AppointmentType, Event } from "@/types/appointment";
import { useToast } from "@chakra-ui/react";
import { useDispatch } from "react-redux";
import { setAvailabilityState } from "@/redux/availabilitySlice";


type DefaultEventsMap = {
  [key: string]: (...args: any[]) => void;
};

const GetAppointments = () => {
  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [formData, setFormData] = useState({} as AppointmentType);
  const toast = useToast();
  const dispatch = useDispatch();



  const getAvailableDates = useCallback(() => {
    return appointmentService.getAvailibity();
  }, []);

  const { data, error, isLoading, isError, isSuccess } =
    useFetch(getAvailableDates);

  const events = data?.data?.map((date: string) => ({
    title: "Available",
    start: new Date(date),
    end: new Date(date),
  }));

  useEffect(() => { dispatch(setAvailabilityState(data?.data)) },[data]);





  const handleEventClick = (event: Event) => {
    if (event.title === "Available") {
      setModalVisible(true);
      const dateObject = new Date(event.end);

      // Format the date to a string that the input can understand
      const formattedDate = dateObject.toISOString().split('T')[0];

      // Set the formatted date as the initial value
      setFormData((prv: SetStateAction<AppointmentType>) => ({ ...prv, date: formattedDate } as AppointmentType));
    }
  };

  const handleSubmit = async () => {
    try {
      await appointmentService.takeAppointment(formData);
      toast({
        title: `Appointment Successful`,
        position: 'top-right',
        status: 'success',
        isClosable: true,
      })
      setModalVisible(false);
      setFormData({} as AppointmentType)
    } catch (error: any) {
      toast({
        title: `${error.response.data.message}`,
        position: 'top-right',
        status: 'error',
        isClosable: true,
      })

    }
  };

  return (
    // <div style={{height:'85vh', overflowY:'scroll', margin:"30px 0px"}}>
    <div>
      <div className="max-h-screen flex items-center justify-center bg-gray-100" >
        <div className="container mx-auto">
          <Calendar events={events} handleEventClick={handleEventClick} />
        </div>
      </div>
      <Modal
        isOpen={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setFormData({} as AppointmentType)
        }}
      >
        <AppointmentForm selectedDate={formData.date} formData={formData} handleSubmit={handleSubmit} setFormData={setFormData} />
      </Modal>
    </div>
  );
};

export default GetAppointments;
