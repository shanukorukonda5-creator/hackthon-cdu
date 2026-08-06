import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import GlassCard from '../components/ui/GlassCard';
import GlassButton from '../components/ui/GlassButton';
import PasswordInput from '../components/forms/PasswordInput';
import PasswordStrengthMeter from '../components/forms/PasswordStrengthMeter';
import { FiArrowLeft } from 'react-icons/fi';

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z
      .string()
      .min(8, 'New password must be at least 8 characters long')
      .regex(
        passwordRegex,
        'New password must contain uppercase, lowercase, number, and special character'
      ),
    confirmNewPassword: z.string().min(1, 'Confirm new password is required'),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: 'New passwords do not match',
    path: ['confirmNewPassword'],
  });

const ChangePasswordPage = () => {
  const { changePassword } = useAuth();
  const navigate = useNavigate();

  const [serverError, setServerError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(changePasswordSchema),
    mode: 'onChange',
  });

  const watchNewPassword = watch('newPassword', '');

  const onSubmit = async (data) => {
    setServerError('');
    setSuccessMsg('');
    try {
      await changePassword({
        currentPassword: data.currentPassword,
        newPassword: data.newPassword,
        confirmNewPassword: data.confirmNewPassword,
      });
      setSuccessMsg('Password changed successfully!');
      reset();
    } catch (err) {
      setServerError(err.message || 'Failed to change password.');
    }
  };

  return (
    <div className="space-y-6 max-w-xl mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-100">Change Password</h1>
          <p className="text-xs text-slate-400 mt-0.5">Update your security credentials</p>
        </div>
        <Link to="/profile">
          <GlassButton variant="secondary" size="sm">
            <FiArrowLeft className="mr-1.5" /> Back to Profile
          </GlassButton>
        </Link>
      </div>

      {successMsg && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400">
          {successMsg}
        </div>
      )}

      {serverError && (
        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400">
          {serverError}
        </div>
      )}

      <GlassCard className="p-6">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <PasswordInput
            label="Current Password"
            placeholder="••••••••"
            error={errors.currentPassword?.message}
            {...register('currentPassword')}
          />

          <PasswordInput
            label="New Password"
            placeholder="••••••••"
            error={errors.newPassword?.message}
            {...register('newPassword')}
          />

          <PasswordStrengthMeter password={watchNewPassword} />

          <PasswordInput
            label="Confirm New Password"
            placeholder="••••••••"
            error={errors.confirmNewPassword?.message}
            {...register('confirmNewPassword')}
          />

          <div className="pt-4 border-t border-white/10 flex justify-end">
            <GlassButton type="submit" variant="primary" loading={isSubmitting}>
              Update Password
            </GlassButton>
          </div>
        </form>
      </GlassCard>
    </div>
  );
};

export default ChangePasswordPage;
