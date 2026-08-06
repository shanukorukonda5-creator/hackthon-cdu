import { useAuth } from './useAuth';

export const useCurrentUser = () => {
  const { user, loading, refreshUser } = useAuth();
  return { user, loading, refreshUser, isAuthenticated: !!user };
};

export default useCurrentUser;
