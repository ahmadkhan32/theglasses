import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

/**
 * Convenience hook for auth context
 */
export const useAuth = () => useContext(AuthContext);
