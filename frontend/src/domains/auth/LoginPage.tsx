import { zodResolver } from '@hookform/resolvers/zod';
import { Alert, Box, Button, Card, CardContent, TextField, Typography } from '@mui/material';
import { useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { useLoginMutation } from '../../api/authApi';
import { useAppDispatch } from '../../store/hooks';
import { setCredentials } from './authSlice';
import { useNavigate } from 'react-router-dom';

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

type FormValues = z.infer<typeof schema>;

export function LoginPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [login, { isLoading }] = useLoginMutation();
  const [error, setError] = useState<string | null>(null);

  const defaultValues = useMemo<FormValues>(() => ({ email: '', password: '' }), []);
  const form = useForm<FormValues>({
    defaultValues,
    resolver: zodResolver(schema)
  });

  return (
    <Box sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center', p: 2 }}>
      <Card sx={{ width: '100%', maxWidth: 420 }}>
        <CardContent>
          <Typography variant="h5" sx={{ mb: 2 }}>
            Sign in
          </Typography>

          {error ? (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          ) : null}

          <Box
            component="form"
            onSubmit={form.handleSubmit(async (values) => {
              setError(null);
              try {
                const res = await login(values).unwrap();
                dispatch(setCredentials(res));
                navigate('/dashboard');
              } catch (e: any) {
                setError(e?.data?.error?.message ?? 'Login failed');
              }
            })}
            sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
          >
            <TextField
              label="Email"
              fullWidth
              {...form.register('email')}
              error={!!form.formState.errors.email}
              helperText={form.formState.errors.email?.message}
            />
            <TextField
              label="Password"
              type="password"
              fullWidth
              {...form.register('password')}
              error={!!form.formState.errors.password}
              helperText={form.formState.errors.password?.message}
            />

            <Button type="submit" variant="contained" disabled={isLoading}>
              {isLoading ? 'Signing in…' : 'Login'}
            </Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
}

