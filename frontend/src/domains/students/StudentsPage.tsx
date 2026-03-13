import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Snackbar,
  TextField
} from '@mui/material';
import { DataGrid, GridColDef } from '@mui/x-data-grid';
import { useMemo, useState } from 'react';
import {
  Student,
  useCreateStudentMutation,
  useDeleteStudentMutation,
  useGetStudentsQuery,
  useUpdateStudentMutation
} from './studentApi';
import { useAppSelector } from '../../store/hooks';

export function StudentsPage() {
  const { data = [], isLoading } = useGetStudentsQuery();
  const [createStudent] = useCreateStudentMutation();
  const [updateStudent] = useUpdateStudentMutation();
  const [deleteStudent] = useDeleteStudentMutation();
  const role = useAppSelector((s) => s.auth.user?.role);
  const token = useAppSelector((s) => s.auth.accessToken);
  const [snack, setSnack] = useState<string | null>(null);

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Student | null>(null);
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
    date_of_birth: '2010-01-01',
    class_id: 1,
    section_id: 1
  });

  const canMutate = role === 'ADMIN' || role === 'TEACHER';

  const columns = useMemo<GridColDef<Student>[]>(
    () => [
      { field: 'id', headerName: 'ID', width: 80 },
      { field: 'first_name', headerName: 'First name', flex: 1, minWidth: 120 },
      { field: 'last_name', headerName: 'Last name', flex: 1, minWidth: 120 },
      { field: 'email', headerName: 'Email', flex: 1.2, minWidth: 180 },
      { field: 'phone', headerName: 'Phone', flex: 1, minWidth: 120 },
      { field: 'date_of_birth', headerName: 'DOB', flex: 1, minWidth: 120 },
      { field: 'class_id', headerName: 'Class', width: 90 },
      { field: 'section_id', headerName: 'Section', width: 90 },
      {
        field: 'actions',
        headerName: 'Actions',
        width: 320,
        renderCell: (params) => (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              size="small"
              variant="outlined"
              disabled={!canMutate}
              onClick={(e) => {
                e.stopPropagation();
                const row = params.row;
                setEditing(row);
                setForm({
                  first_name: row.first_name,
                  last_name: row.last_name,
                  email: row.email,
                  phone: row.phone ?? '',
                  date_of_birth: row.date_of_birth,
                  class_id: row.class_id,
                  section_id: row.section_id
                });
                setOpen(true);
              }}
            >
              Update
            </Button>

            <Button
              size="small"
              variant="outlined"
              color="error"
              disabled={role !== 'ADMIN'}
              onClick={async (e) => {
                e.stopPropagation();
                if (!window.confirm('Are you sure you want to delete this student?')) return;
                try {
                  await deleteStudent(params.row.id).unwrap();
                  setSnack('Student deleted');
                } catch (err: any) {
                  setSnack(err?.data?.error?.message ?? 'Delete failed');
                }
              }}
            >
              Delete
            </Button>
            <Button
              size="small"
              onClick={async (e) => {
                e.stopPropagation();
                try {
                  const response = await fetch(`/api/v1/students/${params.row.id}/report`, {
                    headers: {
                      'Authorization': `Bearer ${token}`
                    }
                  });
                  if (!response.ok) throw new Error('Failed to download report');
                  const blob = await response.blob();
                  const url = window.URL.createObjectURL(blob);
                  const a = document.createElement('a');
                  a.href = url;
                  a.download = `report-${params.row.last_name}.pdf`;
                  document.body.appendChild(a);
                  a.click();
                  window.URL.revokeObjectURL(url);
                  document.body.removeChild(a);
                } catch (err) {
                  setSnack('Failed to download report');
                }
              }}
            >
              PDF
            </Button>
          </Box>
        )
      }
    ],
    [canMutate, deleteStudent, role]
  );


  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2, gap: 1 }}>
        <Button
          variant="contained"
          disabled={!canMutate}
          onClick={() => {
            setEditing(null);
            setForm({
              first_name: '',
              last_name: '',
              email: '',
              phone: '',
              date_of_birth: '2010-01-01',
              class_id: 1,
              section_id: 1
            });
            setOpen(true);
          }}
        >
          Add Student
        </Button>
      </Box>

      <div style={{ height: 520, width: '100%' }}>
        <DataGrid
          rows={data}
          columns={columns}
          loading={isLoading}
          onRowClick={(params) => {
            if (!canMutate) return;
            const row = params.row as Student;
            setEditing(row);
            setForm({
              first_name: row.first_name,
              last_name: row.last_name,
              email: row.email,
              phone: row.phone ?? '',
              date_of_birth: row.date_of_birth,
              class_id: row.class_id,
              section_id: row.section_id
            });
            setOpen(true);
          }}
        />
      </div>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editing ? 'Update Student' : 'Add Student'}</DialogTitle>
        <DialogContent sx={{ display: 'grid', gap: 2, pt: 2 }}>
          <TextField
            label="First name"
            value={form.first_name}
            onChange={(e) => setForm((p) => ({ ...p, first_name: e.target.value }))}
          />
          <TextField
            label="Last name"
            value={form.last_name}
            onChange={(e) => setForm((p) => ({ ...p, last_name: e.target.value }))}
          />
          <TextField
            label="Email"
            value={form.email}
            onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))}
          />
          <TextField
            label="Phone"
            value={form.phone}
            onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))}
          />
          <TextField
            label="Date of birth (YYYY-MM-DD)"
            value={form.date_of_birth}
            onChange={(e) => setForm((p) => ({ ...p, date_of_birth: e.target.value }))}
          />
          <TextField
            label="Class ID"
            type="number"
            value={form.class_id}
            onChange={(e) => setForm((p) => ({ ...p, class_id: Number(e.target.value) }))}
          />
          <TextField
            label="Section ID"
            type="number"
            value={form.section_id}
            onChange={(e) => setForm((p) => ({ ...p, section_id: Number(e.target.value) }))}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          {editing && (
            <Button
              color="error"
              sx={{ mr: 'auto' }}
              disabled={role !== 'ADMIN'}
              onClick={async () => {
                if (!window.confirm('Are you sure you want to delete this student?')) return;
                try {
                  await deleteStudent(editing.id).unwrap();
                  setSnack('Student deleted');
                  setOpen(false);
                } catch (e: any) {
                  setSnack(e?.data?.error?.message ?? 'Delete failed');
                }
              }}
            >
              Delete
            </Button>
          )}
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            disabled={!canMutate}
            onClick={async () => {
              try {
                if (editing) {
                  await updateStudent({ id: editing.id, body: form }).unwrap();
                  setSnack('Student updated');
                } else {
                  await createStudent(form).unwrap();
                  setSnack('Student created');
                }
                setOpen(false);
              } catch (e: any) {
                setSnack(e?.data?.error?.message ?? 'Save failed');
              }
            }}
          >
            {editing ? 'Update' : 'Add'}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={!!snack}
        autoHideDuration={3000}
        onClose={() => setSnack(null)}
        message={snack ?? ''}
      />
    </Box>
  );
}
