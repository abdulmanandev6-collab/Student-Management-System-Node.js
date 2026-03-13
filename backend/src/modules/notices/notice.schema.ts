import { z } from 'zod';

export const noticeCreateSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().min(1).max(5000)
});

export const noticeUpdateSchema = noticeCreateSchema.partial().refine((val) => Object.keys(val).length > 0, {
  message: 'At least one field must be provided'
});

export type NoticeCreateInput = z.infer<typeof noticeCreateSchema>;
export type NoticeUpdateInput = z.infer<typeof noticeUpdateSchema>;

