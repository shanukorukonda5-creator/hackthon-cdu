import { useState } from 'react';
import { useAuth } from './useAuth';

export const useRegister = () => {
  const { register } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const executeRegister = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const res = await register(userData);
      return res;
    } catch (err) {
      setError(err.message || 'Registration failed.');
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { executeRegister, loading, error, setError };
};

export default useRegister;
