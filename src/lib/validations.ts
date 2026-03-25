import { z } from "zod";

export const leadFormSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  company: z.string().optional(),
  budget: z.string().min(1, "Budget is required"),
  timeline: z.string().min(1, "Timeline is required"),
  problemDescription: z
    .string()
    .min(20, "Please describe your problem in at least 20 characters"),
});

export const signupSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const settingsSchema = z.object({
  calendarLink: z.string().url("Invalid URL").optional().or(z.literal("")),
});

export const scoringRulesSchema = z.object({
  budgetWeight: z.number().min(0).max(100),
  timelineWeight: z.number().min(0).max(100),
  urgencyWeight: z.number().min(0).max(100),
  qualityWeight: z.number().min(0).max(100),
  minScore: z.number().min(1).max(10),
});

export type LeadFormData = z.infer<typeof leadFormSchema>;
export type SignupData = z.infer<typeof signupSchema>;
export type LoginData = z.infer<typeof loginSchema>;
export type SettingsData = z.infer<typeof settingsSchema>;
export type ScoringRulesData = z.infer<typeof scoringRulesSchema>;
