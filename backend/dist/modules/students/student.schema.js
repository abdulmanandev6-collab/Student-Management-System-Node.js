import { z } from 'zod';
export const studentCreateSchema = z.object({
    first_name: z.string().min(1),
    last_name: z.string().min(1),
    email: z.string().email(),
    phone: z.string().min(7).max(20).optional().nullable(),
    date_of_birth: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'date_of_birth must be YYYY-MM-DD'),
    class_id: z.number().int().positive(),
    section_id: z.number().int().positive()
});
export const studentUpdateSchema = studentCreateSchema.partial().refine((val) => Object.keys(val).length > 0, {
    message: 'At least one field must be provided'
});
