import { z } from "zod"

export const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    confirmPassword: z.string(),
    userType: z.enum(["manufacturer", "supplier"], {
      required_error: "Please select a user type",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  })

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
})

export const productSchema = z.object({
  name: z.string().min(2, "Product name must be at least 2 characters"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  category: z.string().min(1, "Category is required"),
  price: z.string().min(1, "Price is required"),
  leadTime: z.string().min(1, "Lead time is required"),
  minOrderQuantity: z.string().min(1, "Minimum order quantity is required"),
})

export const inquiryResponseSchema = z.object({
  message: z.string().min(10, "Response message must be at least 10 characters"),
  quotedPrice: z.string().optional(),
  deliveryTime: z.string().optional(),
  notes: z.string().optional(),
})

export type RegisterInput = z.infer<typeof registerSchema>
export type LoginInput = z.infer<typeof loginSchema>
export type ProductInput = z.infer<typeof productSchema>
export type InquiryResponseInput = z.infer<typeof inquiryResponseSchema>
