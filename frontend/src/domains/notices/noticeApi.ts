import { baseApi } from '../../api/baseApi';

export interface Notice {
  id: number;
  title: string;
  content: string;
  created_by: number;
  created_at: string;
}

export const noticeApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getNotices: builder.query<Notice[], void>({
      query: () => ({ url: '/notices' }),
      transformResponse: (res: { success: boolean; data: Notice[] }) => res.data,
      providesTags: ['Notices']
    }),
    createNotice: builder.mutation<Notice, { title: string; content: string }>({
      query: (body) => ({ url: '/notices', method: 'POST', body }),
      transformResponse: (res: { success: boolean; data: Notice }) => res.data,
      invalidatesTags: ['Notices']
    }),
    updateNotice: builder.mutation<Notice, { id: number; body: Partial<Pick<Notice, 'title' | 'content'>> }>({
      query: ({ id, body }) => ({ url: `/notices/${id}`, method: 'PUT', body }),
      transformResponse: (res: { success: boolean; data: Notice }) => res.data,
      invalidatesTags: ['Notices']
    }),
    deleteNotice: builder.mutation<{ deleted: true }, number>({
      query: (id) => ({ url: `/notices/${id}`, method: 'DELETE' }),
      transformResponse: (res: { success: boolean; data: { deleted: true } }) => res.data,
      invalidatesTags: ['Notices']
    })
  })
});

export const {
  useGetNoticesQuery,
  useCreateNoticeMutation,
  useUpdateNoticeMutation,
  useDeleteNoticeMutation
} = noticeApi;

