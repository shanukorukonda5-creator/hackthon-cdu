import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import useRegister from '../hooks/useRegister';
import InputField from '../components/forms/InputField';
import PasswordInput from '../components/forms/PasswordInput';
import PasswordStrengthMeter from '../components/forms/PasswordStrengthMeter';
import GlassButton from '../components/ui/GlassButton';
import { FiUser, FiMail } from 'react-icons/fi';

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/;

const registerSchema = z
  .object({
    fullName: z.string().min(2, 'Full name must be at least 2 characters'),
    email: z.string().email('Valid email address is required'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters long')
      .regex(
        passwordRegex,
        'Password must include uppercase, lowercase, number, and special character'
      ),
    confirmPassword: z.string().min(1, 'Confirm password is required'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

const RegisterPage = () => {
  const { executeRegister } = useRegister();
  const navigate = useNavigate();
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(registerSchema),
    mode: 'onChange',
  });

  const watchPassword = watch('password', '');

  const onSubmit = async (data) => {
    setServerError('');
    try {
      await executeRegister({
        fullName: data.fullName,
        email: data.email,
        password: data.password,
        confirmPassword: data.confirmPassword,
      });
      navigate('/profile');
    } catch (err) {
      setServerError(err.message || 'Registration failed. Please try again.');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-100">Create Account</h2>
        <p className="text-sm text-slate-400 mt-1">Get started with ascess-1-ai</p>
      </div>

      {serverError && (
        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <InputField
          label="Full Name"
          type="text"
          placeholder="Alex Johnson"
          icon={FiUser}
          error={errors.fullName?.message}
          {...register('fullName')}
        />

        <InputField
          label="Email Address"
          type="email"
          placeholder="name@company.com"
          icon={FiMail}
          error={errors.email?.message}
          {...register('email')}
        />

        <PasswordInput
          label="Password"
          placeholder="••••••••"
          error={errors.password?.message}
          {...register('password')}
        />

        <PasswordStrengthMeter password={watchPassword} />

        <PasswordInput
          label="Confirm Password"
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
          Complete Registration
        </GlassButton>
      </form>

      <p className="text-xs text-center text-slate-400">
        Already registered?{' '}
        <Link to="/auth/login" className="text-indigo-400 font-semibold hover:underline">
          Sign In
        </Link>
      </p>
    </div>
  );
};

export default RegisterPage;
