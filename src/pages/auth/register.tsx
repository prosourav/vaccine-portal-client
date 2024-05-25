import { Button, Checkbox, FormControl, FormErrorMessage, FormLabel, Input, Text, useToast } from '@chakra-ui/react';
import Link from 'next/link';
import { Controller, useForm } from "react-hook-form"
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import authService from '@/services/authService';
import formDataSignUp from '@/types/register';
import axios from 'axios';


const defaultValues = {
  name: "",
  email: "",
  password: "",
  termsAndConditions: false,
};

const formSchema = z
  .object({
    name: z.string().min(1, { message: "First name is required" }),
    email: z.string().email({ message: "Please enter a valid email" }),
    password: z
      .string()
      .min(6, { message: "Password must be at least 6 characters" }),
    termsAndConditions: z.boolean().refine(Boolean, {
      message: "The terms and conditions must be accepted.",
    }),
  });

const Signup = (): JSX.Element => {
  const toast = useToast();

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues,
  });


  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.keyCode === 13) {
      handleSubmit(onSubmit)
    }
  };

  const onSubmit = async (data: formDataSignUp) => {
    try {
      const response = await authService.register(data);
      toast({
        title: `${response.message}`,
        position: 'top-right',
        status: 'success',
        isClosable: true,
      })
      console.log("response", response);
    } catch (error: any) {
      console.log("error: ", error);
      toast({
        title: `${error?.response.data.message}`,
        position: 'top-right',
        status: 'error',
        isClosable: true,
      })
    }
  };

  return (
    <main
    >
      <section className='bg-cover bg-center'>
        <div className='flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0'>
          <div className='w-full bg-white rounded-lg shadow md:mt-0 sm:max-w-md xl:p-0'>
            <div className='p-6 space-y-4 md:space-y-6 sm:p-8'>
              <h1 className='text-xl font-bold leading-tight tracking-tight text-green-900 md:text-2xl'>
                Create an account
              </h1>

              <form className='space-y-4 md:space-y-6' onSubmit={handleSubmit(onSubmit)} onKeyDown={handleKeyDown}>


                <FormControl isInvalid={errors.name as undefined} isRequired>
                  <FormLabel className='block mb-2 text-sm font-medium text-green-900'>Name</FormLabel>
                  <Input {...register("name")} type='text' placeholder='John Doe' className='bg-green-100 border border-green-300 text-green-900 sm:text-sm rounde-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5' />
                  <FormErrorMessage>{errors.name?.message}</FormErrorMessage>
                </FormControl>


                <FormControl isInvalid={errors.email?.message as undefined} isRequired>
                  <FormLabel className='block mb-2 text-sm font-medium text-green-900'>Email</FormLabel>
                  <Input {...register("email")} placeholder='johndoe@example.com' className='bg-green-100 border border-green-300 text-green-900 sm:text-sm rounde-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5' />
                  <FormErrorMessage>{errors.email?.message}</FormErrorMessage>
                </FormControl>


                <FormControl isInvalid={errors.password?.message as boolean | undefined} isRequired>
                  <FormLabel className='block mb-2 text-sm font-medium text-green-900'>Password</FormLabel>
                  <Input {...register("password")} type='password' placeholder='**********'
                    className='bg-green-100 border border-green-300 text-green-900 sm:text-sm rounde-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5' />
                  <FormErrorMessage>{errors.password?.message}</FormErrorMessage>
                </FormControl>

                <Controller
                  control={control}
                  name="termsAndConditions"
                  render={({
                    field: {
                      value: isTermsAndConditionsChecked,
                      ...termsAndConditionsField
                    },
                    fieldState: { error: termsAndConditionsError },
                  }) => (
                    <FormControl
                      isInvalid={!!termsAndConditionsError}
                      id="termsAndConditions"
                      isRequired
                    >
                      <Checkbox
                        colorScheme='teal'
                        className=' border-green-600 rounded focus:ring-green-500 focus:ring-2'
                        isChecked={isTermsAndConditionsChecked}
                        {...termsAndConditionsField}
                      >
                        I accept the <a className='font-medium text-primary-600 hover:underline' href='#'>
                          Terms and Conditions
                        </a>
                      </Checkbox>
                      {/* <FormErrorMessage>
                        {termsAndConditionsError?.message}
                      </FormErrorMessage> */}
                    </FormControl>
                  )}
                />


                <Button
                  className='w-full text-white bg-green-600 hover:bg-green-700 focus:ring-4 focus:outline-none focus:ring-green-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center'
                  mt={4}
                  colorScheme='teal'
                  isLoading={isSubmitting}
                  type="submit"
                >
                  Submit
                </Button>
                <Text fontSize='md' className='text-sm font-light text-green-500'>
                  Allready have an account ? <Link href='/auth/login' className='font-medium text-primary-600 hover:underline'>Login here</Link>
                </Text>
              </form>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Signup;