import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type Role = 'ADMIN' | 'TEACHER' | 'STUDENT';

export interface AuthUser {
  id: number;
  email: string;
  role: Role;
  first_name?: string | null;
  last_name?: string | null;
}

interface AuthState {
  user: AuthUser | null;
  accessToken: string | null;
  csrfToken: string | null;
}

const initialState: AuthState = {
  user: null,
  accessToken: null,
  csrfToken: null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: AuthUser; accessToken: string; csrfToken: string }>
    ) => {
      state.user = action.payload.user;
      state.accessToken = action.payload.accessToken;
      state.csrfToken = action.payload.csrfToken;
    },
    setAccessToken: (state, action: PayloadAction<{ accessToken: string; csrfToken: string }>) => {
      state.accessToken = action.payload.accessToken;
      state.csrfToken = action.payload.csrfToken;
    },
    clearAuth: (state) => {
      state.user = null;
      state.accessToken = null;
      state.csrfToken = null;
    }
  }
});

export const { setCredentials, clearAuth, setAccessToken } = authSlice.actions;
export default authSlice.reducer;

