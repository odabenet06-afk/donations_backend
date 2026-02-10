import { z } from "zod";

export const deleteByIdSchema = z
  .object({
    id: z.union([z.string(), z.number()]).optional(),
    project_id: z.union([z.string(), z.number()]).optional(),
  })
  .refine((data) => data.id || data.project_id, "id or project_id is required")
  .transform((data) => ({
    id: String(data.id ?? data.project_id),
  }));

export const deleteUserSchema = z.object({
  username: z.string().min(1),
});

export const usernameSchema = z.object({
  username: z.string().min(1),
});

export const donorSchema = z.object({
  donorData: z.object({
    first_name: z.string().min(1),
    last_name: z.string().min(1),
    email: z.string().email().optional().or(z.literal("")),
    privacy_preference: z.enum(["SHOW_NAME_PUBLICLY", "SHOW_ID_ONLY"]),
    phone: z.string().optional().or(z.literal("")),
    notes: z.string().optional().or(z.literal("")),
    donor_public_id: z.string().optional(),
    id: z.string().optional(),
  }),
});

export const donationDataSchema = z.object({
  id: z.union([z.string(), z.number()]),
  amount: z.coerce.number().positive(),
  currency: z.string().min(2).max(5),
  donor_id: z.string().min(1),
  donor_name: z.string().min(1),
  donation_purpose: z.string().optional().or(z.literal("")),
  receipt_number: z.string().optional().or(z.literal("")),
  project_id: z.string().uuid().nullable().optional(),
});

export const donationSchema = z.object({
  donationData: donationDataSchema,
});

export const createExpenseSchema = z.object({
  amount: z.coerce.number().positive(),
  currency: z.string().min(2).max(5),
  category: z.string().min(1),
  description: z.string().optional().or(z.literal("")),
  project_name: z.string().optional().nullable(),
  attachment_url: z.string().url().optional().or(z.literal("")),
});




const projectBase = {
  name: z.string().min(1),
  description: z.string().optional().or(z.literal("")),
  status: z.enum(["planned", "active", "completed"]),
  startDate: z.coerce.date().optional().nullable().or(z.literal("")),
  endDate: z.coerce.date().optional().nullable().or(z.literal("")),
};

export const createProjectSchema = z.object(projectBase);


export const editProjectSchema = z.object({
  ...projectBase,
  id: z.string().min(1),
});


export const userSchema = z.object({
  username: z.string().min(2),
  password: z.string().min(6).optional().or(z.literal("")),
  role: z.enum(["admin", "staff"]),
  id: z.string().optional(),
});

export const authSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});
