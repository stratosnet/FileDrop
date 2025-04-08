import { pgTable, text, serial, integer, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// We don't need a database schema for this application as it's anonymous
// and doesn't track user data. Keeping this file minimal.

// Define types for file uploads and responses
export const fileUploadResponseSchema = z.object({
  Name: z.string(),
  Hash: z.string(),
  Size: z.string(),
});

export type FileUploadResponse = z.infer<typeof fileUploadResponseSchema>;

export const uploadStatusSchema = z.object({
  id: z.string(),
  fileName: z.string(),
  fileSize: z.string(),
  status: z.enum(['preparing', 'uploading', 'complete', 'error']),
  progress: z.number().min(0).max(100),
  cid: z.string().nullable(),
  shareableLink: z.string().nullable(),
  errorMessage: z.string().nullable(),
  createdAt: z.string().nullable(),
});

export type UploadStatus = z.infer<typeof uploadStatusSchema>;
