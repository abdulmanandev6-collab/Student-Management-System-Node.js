import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import type { RootState } from '../store';

export const baseApi = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: '/api/v1',
    credentials: 'include',
    prepareHeaders: (headers, { getState }) => {
      const state = getState() as RootState;
      const token = state.auth.accessToken;
      const csrfToken = state.auth.csrfToken;

      if (token) headers.set('authorization', `Bearer ${token}`);
      if (csrfToken) headers.set('x-csrf-token', csrfToken);

      return headers;
    }
  }),
  tagTypes: ['Students', 'Notices'],
  endpoints: () => ({})
});

