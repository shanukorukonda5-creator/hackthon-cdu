import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link } from 'react-router-dom';
import InputField from '../components/forms/InputField';
import GlassButton from '../components/ui/GlassButton';
import { FiMail, FiCheckCircle } from 'react-icons/fi';

const forgotSchema = z.object({
  email: z.string().email('Valid email address is required'),
});

const ForgotPasswordPage = () => {
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(forgotSchema),
  });

  const onSubmit = async (data) => {
    // UI Ready password recovery request flow
    await new Promise((resolve) => setTimeout(resolve, 800));
    setSubmitted(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-100">Reset Password</h2>
        <p className="text-sm text-slate-400 mt-1">Enter your registered email address</p>
      </div>

      {submitted ? (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-center space-y-2">
          <FiCheckCircle className="text-emerald-400 text-3xl mx-auto" />
          <p className="text-sm font-semibold text-emerald-300">Password Reset Email Sent</p>
          <p className="text-xs text-slate-400">
            If an account exists with that email, instructions have been sent.
          </p>
          <Link
            to="/auth/login"
            className="inline-block pt-2 text-xs text-indigo-400 hover:underline font-semibold"
          >
            Return to Sign In
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <InputField
            label="Email Address"
            type="email"
            placeholder="name@company.com"
            icon={FiMail}
            error={errors.email?.message}
            {...register('email')}
          />

          <GlassButton
            type="submit"
            variant="primary"
            loading={isSubmitting}
            className="w-full mt-2"
          >
            Send Password Reset Link
          </GlassButton>
        </form>
      )}

      {!submitted && (
        <p className="text-xs text-center text-slate-400">
          Remember your password?{' '}
          <Link to="/auth/login" className="text-indigo-400 font-semibold hover:underline">
            Sign In
          </Link>
        </p>
      )}
    </div>
  );
};

export default ForgotPasswordPage;
