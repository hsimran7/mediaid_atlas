import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(() => localStorage.getItem('mediaid_token'));

  // ── Restore session on mount
  useEffect(() => {
    if (token) {
      authAPI.getMe()
        .then(data => setUser(data.user))
        .catch(() => {
          localStorage.removeItem('mediaid_token');
          setToken(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const data = await authAPI.login({ email, password });
    localStorage.setItem('mediaid_token', data.token);
    setToken(data.token);
    setUser(data.user);
    return data;
  };

  const register = async (formData) => {
    // Strip confirmPassword before sending to backend
    const { confirmPassword, ...cleanData } = formData;
    const data = await authAPI.register(cleanData);
    localStorage.setItem('mediaid_token', data.token);
    setToken(data.token);
    setUser(data.user);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('mediaid_token');
    setToken(null);
    setUser(null);
  };

  const updateUser = (updatedUser) => setUser(updatedUser);

  const refreshUser = async () => {
    try {
      const data = await authAPI.getMe();
      setUser(data.user);
      return data.user;
    } catch (_) {}
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, updateUser, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider');
  return ctx;
};
