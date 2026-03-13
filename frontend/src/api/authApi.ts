import { baseApi } from './baseApi';

export interface LoginResponse {
  user: {
    id: number;
    email: string;
    role: 'ADMIN' | 'TEACHER' | 'STUDENT';
    first_name?: string | null;
    last_name?: string | null;
  };
  accessToken: string;
  csrfToken: string;
}

export const authApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, { email: string; password: string }>({
      query: (body) => ({ url: '/auth/login', method: 'POST', body }),
      transformResponse: (res: { success: boolean; data: LoginResponse }) => res.data
    }),
    logout: builder.mutation<{ message: string }, void>({
      query: () => ({ url: '/auth/logout', method: 'POST' }),
      transformResponse: (res: { success: boolean; data: { message: string } }) => res.data
    }),
    refresh: builder.query<{ accessToken: string; csrfToken: string }, void>({
      query: () => ({ url: '/auth/refresh', method: 'GET' }),
      transformResponse: (res: { success: boolean; data: { accessToken: string; csrfToken: string } }) => res.data
    })
  })
});

export const { useLoginMutation, useLogoutMutation, useLazyRefreshQuery } = authApi;

