import { useContext } from 'react';
import { AuthContext } from './AuthContext';

/**
 * Custom hook to access the auth context
 * @returns {Object} Auth context values (user, loading, error, login, register, logout)
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
}; 