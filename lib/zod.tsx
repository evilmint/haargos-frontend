import * as z from 'zod';

export const updateInstallationFormSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: 'Name must be at least 2 characters.',
    })
    .max(30, {
      message: 'Name must not be longer than 32 characters.',
    }),
  instance: z.string().min(0).max(64),
});

export type UpdateInstallationFormValues = z.infer<typeof updateInstallationFormSchema>;

export const createInstallationFormSchema = z.object({
  name: z
    .string()
    .min(2, {
      message: 'Name must be at least 2 characters.',
    })
    .max(30, {
      message: 'Name must not be longer than 32 characters.',
    }),
  instance: z.string().min(0).max(64),
});

export type CreateInstallationFormValues = z.infer<typeof createInstallationFormSchema>;

export const notesFormSchema = z.object({
  notes: z.string().trim().max(255, {
    message: 'Notes must not be longer than 255 characters.',
  }),
});

export type NotesFormValues = z.infer<typeof notesFormSchema>;
