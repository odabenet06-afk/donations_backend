import { z } from "zod";

const optionalString = z.string().optional().or(z.literal(""));

export const idSchema = z.object({
  id: z.string().uuid(),
});

export const usernameSchema = z.object({
  username: z.string().min(3),
});

export const userDataSchema = z.object({
  username: z.string().min(3),
  password: z.string().min(8).optional().or(z.literal("")),
  role: z.enum(["admin", "staff"]),
});

export const userSchema = z.object({
  userData: userDataSchema,
});

export const donorDataSchema = z.object({
  name: z.string().min(2),
  email: z.string().email().optional().or(z.literal("")),
  phone: optionalString,
});

export const donorSchema = z.object({
  donorData: donorDataSchema,
});

const baseProjectSchema = z.object({
  name: z.string().min(2),
  description: z.string().min(5),
  status: z.enum(["active", "planned", "completed"]),
  start_date: z.coerce.date(),
  end_date: z.coerce.date().optional().nullable(),
});

export const createProjectSchema = baseProjectSchema;

export const editProjectSchema = baseProjectSchema.extend({ 
  id: z.string().uuid() 
});

export const donationDataSchema = z.object({
  amount: z.coerce.number().positive(),
  donor_id: z.string().min(1), 
  project_id: z.string().uuid().optional().nullable(), 
  date: z.coerce.date(),
  currency: z.string().min(2).max(5).default("MKD"),
  donation_purpose: z.string().optional(),
  receipt_number: z.string().optional().or(z.literal("")),
  donor_name: z.string().optional(),
});

export const donationSchema = z.object({
  donationData: donationDataSchema,
});

export const expenseDataSchema = z.object({
  amount: z.coerce.number().positive(),
  category: z.string().min(2),
  description: z.string().min(3),
  date: z.coerce.date(),
  project_id: z.string().uuid("Invalid project selected"),
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
  search: optionalString,
});