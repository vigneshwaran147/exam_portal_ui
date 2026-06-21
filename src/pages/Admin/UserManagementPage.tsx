import { Avatar, Chip, Paper, Stack, Typography } from "@mui/material";
import PageHeader from "@/components/common/PageHeader";
import { usePortal } from "@/hooks/usePortal";

function UserManagementPage() {
  const { users } = usePortal();

  return (
    <>
      <PageHeader title="User Management" subtitle="Manage employees, administrators, departments, and roles" />
      <Stack spacing={2}>
        {users.map((user) => (
          <Paper key={user.id} elevation={0} sx={{ p: 2.5, border: "1px solid", borderColor: "divider" }}>
            <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between">
              <Stack direction="row" spacing={2} alignItems="center">
                <Avatar>{user.fullName.charAt(0)}</Avatar>
                <Stack>
                  <Typography variant="subtitle1">{user.fullName}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {user.id} • {user.department}
                  </Typography>
                </Stack>
              </Stack>
              <Stack direction="row" spacing={1}>
                <Chip size="small" label={user.role} color="primary" variant="outlined" />
                <Chip size="small" label={`Level ${user.currentLevel}`} color="secondary" variant="outlined" />
              </Stack>
            </Stack>
          </Paper>
        ))}
      </Stack>
    </>
  );
}

export default UserManagementPage;
