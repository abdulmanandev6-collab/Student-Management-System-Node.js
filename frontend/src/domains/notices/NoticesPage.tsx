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
import { useAppSelector } from '../../store/hooks';
import {
  Notice,
  useCreateNoticeMutation,
  useDeleteNoticeMutation,
  useGetNoticesQuery,
  useUpdateNoticeMutation
} from './noticeApi';

export function NoticesPage() {
  const { data = [], isLoading } = useGetNoticesQuery();
  const [createNotice] = useCreateNoticeMutation();
  const [updateNotice] = useUpdateNoticeMutation();
  const [deleteNotice] = useDeleteNoticeMutation();
  const role = useAppSelector((s) => s.auth.user?.role);
  const [snack, setSnack] = useState<string | null>(null);

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Notice | null>(null);
  const [form, setForm] = useState({
    title: '',
    content: ''
  });

  const canMutate = role === 'ADMIN' || role === 'TEACHER';

  const columns = useMemo<GridColDef<Notice>[]>(
    () => [
      { field: 'id', headerName: 'ID', width: 80 },
      { field: 'title', headerName: 'Title', flex: 1, minWidth: 180 },
      { field: 'content', headerName: 'Content', flex: 2, minWidth: 240 },
      { field: 'created_by', headerName: 'By', width: 100 },
      { field: 'created_at', headerName: 'Created', flex: 1, minWidth: 180 },
      {
        field: 'actions',
        headerName: 'Actions',
        width: 280,
        renderCell: (params) => (
          <Box sx={{ display: 'flex', gap: 1 }}>
            <Button
              size="small"
              variant="outlined"
              disabled={!canMutate}
              onClick={(e) => {
                e.stopPropagation();
                const row = params.row as Notice;
                setEditing(row);
                setForm({ title: row.title, content: row.content });
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
                if (!window.confirm('Are you sure you want to delete this notice?')) return;
                try {
                  await deleteNotice(params.row.id).unwrap();
                  setSnack('Notice deleted');
                } catch (err: any) {
                  setSnack(err?.data?.error?.message ?? 'Delete failed');
                }
              }}
            >
              Delete
            </Button>
          </Box>
        )
      }
    ],
    [canMutate, deleteNotice]
  );


  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2, gap: 1 }}>
        <Button
          variant="contained"
          disabled={!canMutate}
          onClick={() => {
            setEditing(null);
            setForm({ title: '', content: '' });
            setOpen(true);
          }}
        >
          Add Notice
        </Button>
      </Box>

      <div style={{ height: 520, width: '100%' }}>
        <DataGrid
          rows={data}
          columns={columns}
          loading={isLoading}
          onRowClick={(params) => {
            if (!canMutate) return;
            const row = params.row as Notice;
            setEditing(row);
            setForm({ title: row.title, content: row.content });
            setOpen(true);
          }}
        />
      </div>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editing ? 'Update Notice' : 'Add Notice'}</DialogTitle>
        <DialogContent sx={{ display: 'grid', gap: 2, pt: 2 }}>
          <TextField
            label="Title"
            fullWidth
            value={form.title}
            onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
          />
          <TextField
            label="Content"
            fullWidth
            multiline
            rows={4}
            value={form.content}
            onChange={(e) => setForm((p) => ({ ...p, content: e.target.value }))}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          {editing && (
            <Button
              color="error"
              sx={{ mr: 'auto' }}
              onClick={async () => {
                if (!window.confirm('Are you sure?')) return;
                try {
                  await deleteNotice(editing.id).unwrap();
                  setSnack('Notice deleted');
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
            onClick={async () => {
              try {
                if (editing) {
                  await updateNotice({ id: editing.id, body: form }).unwrap();
                  setSnack('Notice updated');
                } else {
                  await createNotice(form).unwrap();
                  setSnack('Notice created');
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
