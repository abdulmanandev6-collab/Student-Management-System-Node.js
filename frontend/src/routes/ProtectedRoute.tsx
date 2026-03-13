import { Navigate } from 'react-router-dom';
import { useAppSelector } from '../store/hooks';
import { useEffect } from 'react';
import { useLazyRefreshQuery } from '../api/authApi';
import { useAppDispatch } from '../store/hooks';
import { setAccessToken } from '../domains/auth/authSlice';

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const token = useAppSelector((s) => s.auth.accessToken);
  const dispatch = useAppDispatch();
  const [refresh, { isLoading, isUninitialized }] = useLazyRefreshQuery();

  useEffect(() => {
    if (!token) {
      refresh()
        .unwrap()
        .then((res) => dispatch(setAccessToken(res)))
        .catch(() => null);
    }
  }, []); // run once on mount only

  // If token already in Redux (just logged in) → render immediately
  if (token) return <>{children}</>;

  // No token yet: waiting for refresh attempt to finish
  if (isUninitialized || isLoading) return null;

  // Refresh finished but still no token → send to login
  return <Navigate to="/login" replace />;
}



