import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Select,
} from "@chakra-ui/react";
import {vaccineOptions} from "@/constants/vaccines";
import { SetStateAction } from "react";
import { propsType } from "@/types/appointment";

// AppointmentType
const AppointmentForm = ({ selectedDate, handleSubmit, setFormData, formData }: propsType) => {

  interface AppointmentType { vaccine: string, date: string }

  const handleForm = ({ target }: React.ChangeEvent<HTMLSelectElement>) => {
    const data = target.value;
    setFormData((prv: SetStateAction<AppointmentType>) => ({ ...prv, vaccine: data } as AppointmentType));
  };

  return (
    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
      <h1 className="text-xl font-bold leading-tight tracking-tight text-green-900 md:text-2xl">
        Book Your Slot
      </h1>
      <form className="space-y-4 md:space-y-6">
        <FormControl isRequired>
          <FormLabel className="block mb-2 text-sm font-medium text-green-900">
            Vaccine
          </FormLabel>
          <Select placeholder="Select option" onChange={handleForm}>
            {vaccineOptions.map((item, index) => (
              <option value={item} key={index}>
                {item}
              </option>
            ))}
          </Select>
          <FormErrorMessage>Error</FormErrorMessage>
        </FormControl>

        <FormControl isRequired>
          <FormLabel className="block mb-2 text-sm font-medium text-green-900">
            Select Date
          </FormLabel>
          <Input readOnly value={selectedDate} size="md" type="date" />
          <FormErrorMessage>Error</FormErrorMessage>
        </FormControl>

        <Button
          className="w-full text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center"
          mt={4}
          colorScheme="teal"
          onClick={handleSubmit}
          isDisabled={formData.vaccine ? false : true }
        >
          Submit
        </Button>
      </form>
    </div>
  )
};

export default AppointmentForm;