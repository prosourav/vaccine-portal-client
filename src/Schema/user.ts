import { z } from "zod";

export const userformSchema = z
    .object({
        email: z.string().email({ message: "Please enter a valid email" }),
        password: z
            .string()
            .min(6, { message: "Password must be at least 6 characters" }),
        status: z.string()    
    });

export const userCreateFormSchema = z
.object({
  name: z.string().min(1, { message: "First name is required" }),
  email: z.string().email({ message: "Please enter a valid email" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
});
