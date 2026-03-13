import { AppBar, Box, Button, Container, Toolbar, Typography } from '@mui/material';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { clearAuth } from '../../domains/auth/authSlice';
import { useLogoutMutation } from '../../api/authApi';

export function MainLayout() {
  const user = useAppSelector((s) => s.auth.user);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [logout] = useLogoutMutation();

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
      <AppBar position="sticky" elevation={0}>
        <Toolbar sx={{ gap: 2 }}>
          <Typography variant="h6" sx={{ flexGrow: 1 }}>
            Student Management System
          </Typography>

          <Button color="inherit" component={NavLink} to="/dashboard">
            Dashboard
          </Button>
          <Button color="inherit" component={NavLink} to="/students">
            Students
          </Button>
          <Button color="inherit" component={NavLink} to="/notices">
            Notices
          </Button>

          <Typography variant="body2" sx={{ mx: 2, opacity: 0.9 }}>
            {user?.email}
          </Typography>

          <Button
            color="inherit"
            onClick={() => {
              logout();
              dispatch(clearAuth());
              navigate('/login');
            }}
          >
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      <Container sx={{ py: 3 }}>
        <Outlet />
      </Container>
    </Box>
  );
}

