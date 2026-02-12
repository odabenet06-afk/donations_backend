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

const donorCore = {
  first_name: z.string().min(1),
  last_name: z.string().min(1),
  email: z.string().email().optional().or(z.literal("")),
  privacy_preference: z.enum(["SHOW_NAME_PUBLICLY", "SHOW_ID_ONLY"]),
  phone: z.string().optional().or(z.literal("")),
  notes: z.string().optional().or(z.literal("")),
};

export const createDonorSchema = z.object({
  donorData: z.object({
    ...donorCore,
  }),
});

export const editDonorSchema = z.object({
  donorData: z.object({
    id: z.union([z.string(), z.number()]).optional(),
    donor_public_id: z.string().min(1),
    ...donorCore,
  }),
});

export const deleteDonorSchema = z.object({
  id: z.string().min(1),
});

export const donationDataSchema = z.object({
  id: z.union([z.string(), z.number()]).optional(),
  amount: z.coerce.number().positive(),
  currency: z.string().min(2).max(5),
  donor_id: z.string().min(1),
  donor_name: z.string().min(1),
  donation_purpose: z.string().nullish().or(z.literal("")),
  receipt_number: z.string().nullish().or(z.literal("")),
  project_id: z.any().optional(),
});

export const donationSchema = z.object({
  donationData: donationDataSchema,
});

export const createExpenseSchema = z.object({
  expenseData: z.object({
    amount: z.coerce.number().positive(),
    currency: z.string().min(2).max(5),
    category: z.string().min(1),
    description: z.string().optional().default(""),
    project_name: z.string().optional().nullable(),
    attachment_url: z
      .union([z.string().url(), z.literal(""), z.null()])
      .optional(),
  }),
});

const projectBase = {
  name: z.string().min(1),
  description: z.string().nullish().or(z.literal("")),
  status: z.enum(["planned", "active", "completed"]),
  start_date: z.string().optional().nullable().or(z.literal("")),
  end_date: z.string().optional().nullable().or(z.literal("")),
};

export const editProjectSchema = z.object({
  ...projectBase,
  id: z.number().positive(),
});

export const createProjectSchema = z.object(projectBase);

export const userSchema = z.object({
  userData: z.object({
    username: z.string().min(2),
    password: z.string().min(6).optional().or(z.literal("")),
    role: z.enum(["admin", "staff"]),
    id: z.string().optional(),
    before: z.string().optional(),
  }),
});
export const authSchema = z.object({
  username: z.string().min(1),
  password: z.string().min(1),
});
