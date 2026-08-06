import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import useLogin from '../hooks/useLogin';
import InputField from '../components/forms/InputField';
import PasswordInput from '../components/forms/PasswordInput';
import GlassButton from '../components/ui/GlassButton';
import { FiMail } from 'react-icons/fi';

const loginSchema = z.object({
  email: z.string().email('Valid email address is required'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional(),
});

const LoginPage = () => {
  const { executeLogin } = useLogin();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const isExpired = searchParams.get('expired') === 'true';
  const [serverError, setServerError] = useState('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      rememberMe: true,
    },
  });

  const onSubmit = async (data) => {
    setServerError('');
    try {
      await executeLogin({ email: data.email, password: data.password });
      navigate('/profile');
    } catch (err) {
      setServerError(err.message || 'Login failed. Please check credentials.');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-100">Sign In</h2>
        <p className="text-sm text-slate-400 mt-1">Access your ascess-1-ai account</p>
      </div>

      {isExpired && (
        <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-400">
          Your session expired. Please sign in again.
        </div>
      )}

      {serverError && (
        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400">
          {serverError}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
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

        <div className="flex items-center justify-between text-xs">
          <label className="flex items-center space-x-2 cursor-pointer text-slate-300">
            <input
              type="checkbox"
              className="rounded bg-slate-900 border-white/10 text-indigo-600 focus:ring-indigo-500"
              {...register('rememberMe')}
            />
            <span>Remember Me</span>
          </label>

          <Link
            to="/auth/forgot-password"
            className="text-indigo-400 hover:text-indigo-300 transition-colors font-medium"
          >
            Forgot Password?
          </Link>
        </div>

        <GlassButton
          type="submit"
          variant="primary"
          loading={isSubmitting}
          className="w-full mt-2"
        >
          Sign In
        </GlassButton>
      </form>

      <p className="text-xs text-center text-slate-400">
        Don't have an account?{' '}
        <Link to="/auth/register" className="text-indigo-400 font-semibold hover:underline">
          Create Account
        </Link>
      </p>
    </div>
  );
};

export default LoginPage;
