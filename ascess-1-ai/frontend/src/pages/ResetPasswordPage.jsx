import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import PasswordInput from '../components/forms/PasswordInput';
import PasswordStrengthMeter from '../components/forms/PasswordStrengthMeter';
import GlassButton from '../components/ui/GlassButton';
import { FiCheckCircle } from 'react-icons/fi';

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;

const resetSchema = z
  .object({
    newPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters long')
      .regex(
        passwordRegex,
        'Password must include uppercase, lowercase, number, and special character'
      ),
    confirmPassword: z.string().min(1, 'Confirm password is required'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

const ResetPasswordPage = () => {
  const [success, setSuccess] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(resetSchema),
  });

  const watchPassword = watch('newPassword', '');

  const onSubmit = async (data) => {
    // UI Ready password reset confirmation flow
    await new Promise((resolve) => setTimeout(resolve, 800));
    setSuccess(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-100">Set New Password</h2>
        <p className="text-sm text-slate-400 mt-1">Create a new secure password for your account</p>
      </div>

      {success ? (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center space-y-2">
          <FiCheckCircle className="text-emerald-400 text-3xl mx-auto" />
          <p className="text-sm font-semibold text-emerald-300">Password Reset Successful</p>
          <p className="text-xs text-slate-400">You can now sign in with your new password.</p>
          <Link
            to="/auth/login"
            className="inline-block pt-2 text-xs text-indigo-400 hover:underline font-semibold"
          >
            Sign In Now
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <PasswordInput
            label="New Password"
            placeholder="••••••••"
            error={errors.newPassword?.message}
            {...register('newPassword')}
          />

          <PasswordStrengthMeter password={watchPassword} />

          <PasswordInput
            label="Confirm New Password"
            placeholder="••••••••"
            error={errors.confirmPassword?.message}
            {...register('confirmPassword')}
          />

          <GlassButton
            type="submit"
            variant="primary"
            loading={isSubmitting}
            className="w-full mt-2"
          >
            Update Password
          </GlassButton>
        </form>
      )}
    </div>
  );
};

export default ResetPasswordPage;
