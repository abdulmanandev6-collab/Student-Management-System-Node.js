import { Card, CardContent, Grid, Typography } from '@mui/material';
import { useGetNoticesQuery } from '../notices/noticeApi';
import { useGetStudentsQuery } from '../students/studentApi';

function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <Card>
      <CardContent>
        <Typography variant="overline" color="text.secondary">
          {label}
        </Typography>
        <Typography variant="h4">{value}</Typography>
      </CardContent>
    </Card>
  );
}

export function DashboardPage() {
  const { data: students } = useGetStudentsQuery();
  const { data: notices } = useGetNoticesQuery();

  const recentNotices = (notices ?? []).slice(0, 5);

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={4}>
        <StatCard label="Students" value={String(students?.length ?? 0)} />
      </Grid>
      <Grid item xs={12} md={4}>
        <StatCard label="Notices" value={String(notices?.length ?? 0)} />
      </Grid>

      <Grid item xs={12}>
        <Card>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 1 }}>
              Recent notices
            </Typography>
            {recentNotices.length === 0 ? (
              <Typography color="text.secondary">No notices yet.</Typography>
            ) : (
              recentNotices.map((n) => (
                <Typography key={n.id} sx={{ mb: 1 }}>
                  <strong>{n.title}</strong> — {n.content}
                </Typography>
              ))
            )}
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}

