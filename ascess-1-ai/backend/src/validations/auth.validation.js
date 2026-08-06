import { z } from 'zod';

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;

export const registerSchema = z.object({
  body: z
    .object({
      fullName: z.string().min(2, 'Full name must be at least 2 characters long'),
      email: z.string().email('Invalid email address format'),
      password: z
        .string()
        .min(8, 'Password must be at least 8 characters long')
        .regex(
          passwordRegex,
          'Password must contain at least 1 uppercase, 1 lowercase, 1 number, and 1 special character'
        ),
      confirmPassword: z.string().min(1, 'Confirm password is required'),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: 'Passwords do not match',
      path: ['confirmPassword'],
    }),
});

export const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address format'),
    password: z.string().min(1, 'Password is required'),
  }),
});
