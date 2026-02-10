import { z } from "zod";

export const idSchema = z.object({
  id: z.string().uuid(),
});

export const usernameSchema = z.object({
  username: z.string().min(3),
});

export const userDataSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(8).optional(),
  role: z.enum(["admin", "staff"]),
});

export const userSchema = z.object({
  userData: userDataSchema,
});

export const donorDataSchema = z.object({
  name: z.string().min(2),
  email: z.string().email().optional(),
  phone: z.string().optional(),
});

export const donorSchema = z.object({
  donorData: donorDataSchema,
});

const baseProjectSchema = z.object({
  name: z.string().min(2),
  description: z.string().min(5),
  status: z.enum(["active", "planned", "completed"]),
  start_date: z.coerce.date(),
  end_date: z.coerce.date().optional(),
});

export const createProjectSchema = baseProjectSchema;

export const editProjectSchema = baseProjectSchema.extend({ 
  id: z.string().uuid() 
});

export const donationDataSchema = z.object({
  amount: z.coerce.number().positive(),
  donor_id: z.string().uuid(),
  project_id: z.string().uuid(),
  date: z.coerce.date(),
  note: z.string().optional(),
});

export const donationSchema = z.object({
  donationData: donationDataSchema,
});

export const expenseDataSchema = z.object({
  amount: z.coerce.number().positive(),
  category: z.string().min(2),
  description: z.string().min(3),
  date: z.coerce.date(),
  project_id: z.string().uuid(),
});

export const createExpenseSchema = z.object({
  expenseData: expenseDataSchema,
});

export const authSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(8),
});

export const loadDataQuerySchema = z.object({
  year: z.coerce.number().int().min(2000),
  month: z.coerce.number().int().min(1).max(12).optional(),
  search: z.string().trim().min(1).optional(),
});