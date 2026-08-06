import { useState } from 'react';
import { useAuth } from './useAuth';

export const useLogin = () => {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const executeLogin = async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const res = await login(credentials);
      return res;
    } catch (err) {
      setError(err.message || 'Login failed.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { executeLogin, loading, error, setError };
};

export default useLogin;
