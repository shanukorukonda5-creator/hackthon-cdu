import { z } from 'zod';

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;

export const updateProfileSchema = z.object({
  body: z.object({
    fullName: z.string().min(2, 'Full name must be at least 2 characters long').optional(),
    avatarUrl: z.string().url('Invalid avatar URL format').or(z.string().length(0)).optional(),
  }),
});

export const changePasswordSchema = z.object({
  body: z
    .object({
      currentPassword: z.string().min(1, 'Current password is required'),
      newPassword: z
        .string()
        .min(8, 'New password must be at least 8 characters long')
        .regex(
          passwordRegex,
          'Password must contain at least 1 uppercase, 1 lowercase, 1 number, and 1 special character'
        ),
      confirmNewPassword: z.string().min(1, 'Confirm new password is required'),
    })
    .refine((data) => data.newPassword === data.confirmNewPassword, {
      message: 'New passwords do not match',
      path: ['confirmNewPassword'],
    }),
});
