import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Link, useNavigate } from 'react-router-dom';
import useCurrentUser from '../hooks/useCurrentUser';
import useAuth from '../hooks/useAuth';
import GlassCard from '../components/ui/GlassCard';
import GlassButton from '../components/ui/GlassButton';
import InputField from '../components/forms/InputField';
import Badge from '../components/ui/Badge';
import Modal from '../components/ui/Modal';
import { formatDate } from '../utils/helpers';
import { FiUser, FiMail, FiCalendar, FiShield, FiKey, FiTrash2, FiCamera } from 'react-icons/fi';

const profileSchema = z.object({
  fullName: z.string().min(2, 'Full name must be at least 2 characters'),
  avatarUrl: z.string().url('Invalid avatar URL format').or(z.string().length(0)).optional(),
});

const ProfilePage = () => {
  const { user } = useCurrentUser();
  const { updateProfile, deleteAccount } = useAuth();
  const navigate = useNavigate();

  const [message, setMessage] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(profileSchema),
    values: {
      fullName: user?.full_name || '',
      avatarUrl: user?.avatar_url || '',
    },
  });

  const onSubmit = async (data) => {
    setMessage('');
    setErrorMsg('');
    try {
      await updateProfile(data);
      setMessage('Profile updated successfully!');
    } catch (err) {
      setErrorMsg(err.message || 'Failed to update profile.');
    }
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);
    try {
      await deleteAccount();
      navigate('/auth/login');
    } catch (err) {
      setErrorMsg(err.message || 'Failed to delete account.');
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-8 max-w-4xl">
      <div>
        <h1 className="text-3xl font-extrabold text-slate-100 tracking-tight">Account Profile</h1>
        <p className="text-slate-400 text-sm mt-1">Manage your identity, personal details, and account settings.</p>
      </div>

      {message && (
        <div className="p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-400">
          {message}
        </div>
      )}

      {errorMsg && (
        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-xs text-red-400">
          {errorMsg}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* User Card Summary */}
        <GlassCard className="flex flex-col items-center text-center p-6 space-y-4">
          <div className="relative">
            <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-3xl font-bold text-white shadow-xl overflow-hidden border-2 border-white/20">
              {user?.avatar_url ? (
                <img src={user.avatar_url} alt={user.full_name} className="w-full h-full object-cover" />
              ) : (
                user?.full_name ? user.full_name[0].toUpperCase() : 'U'
              )}
            </div>
          </div>

          <div>
            <h3 className="text-lg font-bold text-slate-100">{user?.full_name}</h3>
            <p className="text-xs text-slate-400 mt-0.5">{user?.email}</p>
          </div>

          <Badge variant="info" className="uppercase tracking-wider">
            {user?.role || 'User'}
          </Badge>

          <div className="w-full border-t border-white/10 pt-4 space-y-2 text-xs text-slate-400 text-left">
            <div className="flex items-center justify-between">
              <span className="flex items-center space-x-1.5"><FiCalendar /> <span>Joined</span></span>
              <span className="font-mono text-slate-200">{formatDate(user?.created_at)}</span>
            </div>
          </div>

          <div className="w-full pt-2">
            <Link to="/profile/change-password">
              <GlassButton variant="secondary" size="sm" className="w-full">
                <FiKey className="mr-1.5" /> Change Password
              </GlassButton>
            </Link>
          </div>
        </GlassCard>

        {/* Edit Profile Form */}
        <GlassCard className="md:col-span-2 space-y-6 p-6">
          <h3 className="text-base font-bold text-slate-200 pb-2 border-b border-white/10">Personal Details</h3>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <InputField
              label="Email Address (Read Only)"
              type="email"
              value={user?.email || ''}
              disabled
              icon={FiMail}
              className="opacity-75 cursor-not-allowed"
            />

            <InputField
              label="Full Name"
              type="text"
              icon={FiUser}
              error={errors.fullName?.message}
              {...register('fullName')}
            />

            <InputField
              label="Avatar Image URL (Optional)"
              type="url"
              placeholder="https://example.com/avatar.jpg"
              icon={FiCamera}
              error={errors.avatarUrl?.message}
              {...register('avatarUrl')}
            />

            <div className="pt-4 border-t border-white/10 flex items-center justify-between">
              <GlassButton
                type="button"
                variant="danger"
                size="sm"
                onClick={() => setIsDeleteModalOpen(true)}
              >
                <FiTrash2 className="mr-1.5" /> Delete Account
              </GlassButton>

              <GlassButton type="submit" variant="primary" loading={isSubmitting}>
                Save Profile Changes
              </GlassButton>
            </div>
          </form>
        </GlassCard>
      </div>

      {/* Delete Account Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Account Deletion"
      >
        <div className="space-y-4">
          <p className="text-sm text-slate-300">
            Are you sure you want to delete your account? This action is permanent and will delete all user data from Supabase.
          </p>
          <div className="flex justify-end space-x-3 pt-2">
            <GlassButton variant="secondary" onClick={() => setIsDeleteModalOpen(false)}>
              Cancel
            </GlassButton>
            <GlassButton variant="danger" loading={deleting} onClick={handleDeleteAccount}>
              Confirm Delete
            </GlassButton>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default ProfilePage;
