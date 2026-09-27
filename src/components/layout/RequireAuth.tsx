import { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import { useOrderStore } from '../../store/orderStore';

export const RequireAuth = () => {
  const { user } = useAuthStore();
  const location = useLocation();
  const setActiveUser = useOrderStore((state) => state.setActiveUser);
  const userId = user?.uid ?? null;

  useEffect(() => {
    setActiveUser(userId);
  }, [setActiveUser, userId]);

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <Outlet />;
};
