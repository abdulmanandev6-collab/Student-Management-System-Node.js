import { baseApi } from '../../api/baseApi';

export interface Student {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string | null;
  date_of_birth: string;
  class_id: number;
  section_id: number;
  created_at: string;
  updated_at: string;
}

export const studentApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getStudents: builder.query<Student[], void>({
      query: () => ({ url: '/students' }),
      transformResponse: (res: { success: boolean; data: Student[] }) => res.data,
      providesTags: ['Students']
    }),
    createStudent: builder.mutation<Student, Partial<Student>>({
      query: (body) => ({ url: '/students', method: 'POST', body }),
      transformResponse: (res: { success: boolean; data: Student }) => res.data,
      invalidatesTags: ['Students']
    }),
    updateStudent: builder.mutation<Student, { id: number; body: Partial<Student> }>({
      query: ({ id, body }) => ({ url: `/students/${id}`, method: 'PUT', body }),
      transformResponse: (res: { success: boolean; data: Student }) => res.data,
      invalidatesTags: ['Students']
    }),
    deleteStudent: builder.mutation<{ deleted: true }, number>({
      query: (id) => ({ url: `/students/${id}`, method: 'DELETE' }),
      transformResponse: (res: { success: boolean; data: { deleted: true } }) => res.data,
      invalidatesTags: ['Students']
    })
  })
});

export const {
  useGetStudentsQuery,
  useCreateStudentMutation,
  useUpdateStudentMutation,
  useDeleteStudentMutation
} = studentApi;

