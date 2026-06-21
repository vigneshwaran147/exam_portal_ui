import {
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Grid,
  IconButton,
  InputAdornment,
  MenuItem,
  Stack,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Tabs,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import LockResetIcon from "@mui/icons-material/LockReset";
import BlockIcon from "@mui/icons-material/Block";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import AddIcon from "@mui/icons-material/Add";
import BusinessIcon from "@mui/icons-material/Business";
import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import PageHeader from "@/components/common/PageHeader";
import { usePortal } from "@/hooks/usePortal";
import type { UserProfile } from "@/types/auth";

const DEPARTMENTS = ["Information Security", "Compliance", "Risk Management", "HR", "Engineering", "Finance", "Operations"];

function UserManagementPage() {
  const { users, companies, addEmployee, updateEmployee } = usePortal();
  const [searchParams] = useSearchParams();
  const preselectedCompany = searchParams.get("company") ?? "ALL";

  const [selectedCompany, setSelectedCompany] = useState(preselectedCompany);
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [form, setForm] = useState<Omit<UserProfile, "id">>({
    fullName: "",
    department: "Information Security",
    designation: "",
    email: "",
    mobile: "",
    companyId: preselectedCompany !== "ALL" ? preselectedCompany : (companies[0]?.id ?? ""),
    role: "EMPLOYEE",
    currentLevel: 0,
    status: "ACTIVE",
  });

  const visibleUsers = users.filter((u) => {
    const matchCompany = selectedCompany === "ALL" || u.companyId === selectedCompany;
    const matchSearch =
      u.fullName.toLowerCase().includes(search.toLowerCase()) ||
      u.id.toLowerCase().includes(search.toLowerCase()) ||
      u.department.toLowerCase().includes(search.toLowerCase());
    return matchCompany && matchSearch;
  });

  const roleColor = (role: string) => {
    if (role === "SUPER_ADMIN") return "error" as const;
    if (role === "ADMIN") return "warning" as const;
    return "primary" as const;
  };

  const levelColor = (level: number) => {
    if (level >= 2) return "success" as const;
    if (level === 1) return "info" as const;
    return "default" as const;
  };

  const companyName = (id: string) => companies.find((c) => c.id === id)?.name ?? id;

  const handleAdd = () => {
    addEmployee(form);
    setDialogOpen(false);
    setForm((f) => ({ ...f, fullName: "", email: "", mobile: "", designation: "" }));
  };

  return (
    <>
      <PageHeader
        title="Employee Management"
        subtitle="Manage employees per company — onboard, assign levels, and control access"
        action={
          <Button variant="contained" size="small" startIcon={<AddIcon />} onClick={() => setDialogOpen(true)}>
            Add Employee
          </Button>
        }
      />

      {/* Company tabs */}
      <Card elevation={0} sx={{ border: "1px solid", borderColor: "divider", mb: 3 }}>
        <Tabs
          value={selectedCompany}
          onChange={(_, v) => setSelectedCompany(v)}
          variant="scrollable"
          scrollButtons="auto"
          sx={{ px: 1 }}
        >
          <Tab label="All Companies" value="ALL" />
          {companies.map((c) => (
            <Tab
              key={c.id}
              value={c.id}
              label={
                <Stack direction="row" spacing={1} alignItems="center">
                  <span>{c.name}</span>
                  <Chip
                    size="small"
                    label={users.filter((u) => u.companyId === c.id && u.role === "EMPLOYEE").length}
                    sx={{ height: 18, fontSize: "0.7rem" }}
                  />
                </Stack>
              }
            />
          ))}
        </Tabs>
      </Card>

      {/* Per-company summary when filtered */}
      {selectedCompany !== "ALL" && (() => {
        const company = companies.find((c) => c.id === selectedCompany);
        const compUsers = users.filter((u) => u.companyId === selectedCompany);
        if (!company) return null;
        return (
          <Card elevation={0} sx={{ border: "1px solid", borderColor: "primary.200", bgcolor: "primary.50", mb: 3 }}>
            <CardContent>
              <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 1 }}>
                <BusinessIcon color="primary" />
                <Typography variant="h6" fontWeight={700}>{company.name}</Typography>
                <Chip size="small" label={company.status} color={company.status === "ACTIVE" ? "success" : "error"} />
              </Stack>
              <Grid container spacing={2}>
                {[
                  { label: "Employees", value: compUsers.filter((u) => u.role === "EMPLOYEE").length },
                  { label: "Admins", value: compUsers.filter((u) => u.role === "ADMIN").length },
                  { label: "Pass %", value: `${company.passPercentage}%` },
                  { label: "Max Levels", value: `L0–L${company.maxExamLevels - 1}` },
                ].map((item) => (
                  <Grid key={item.label} size={{ xs: 6, sm: 3 }}>
                    <Typography variant="h5" fontWeight={800}>{item.value}</Typography>
                    <Typography variant="caption" color="text.secondary">{item.label}</Typography>
                  </Grid>
                ))}
              </Grid>
            </CardContent>
          </Card>
        );
      })()}

      {/* Search */}
      <TextField
        fullWidth placeholder="Search by name, ID, or department…"
        value={search} onChange={(e) => setSearch(e.target.value)}
        size="small" sx={{ mb: 2, maxWidth: 480 }}
        InputProps={{
          startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment>,
        }}
      />

      <Card elevation={0} sx={{ border: "1px solid", borderColor: "divider" }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "grey.50" }}>
              <TableCell sx={{ fontWeight: 700 }}>Employee</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>ID</TableCell>
              {selectedCompany === "ALL" && <TableCell sx={{ fontWeight: 700 }}>Company</TableCell>}
              <TableCell sx={{ fontWeight: 700 }}>Department</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Role</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Level</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 700 }} align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {visibleUsers.map((user) => (
              <TableRow key={user.id} hover>
                <TableCell>
                  <Stack direction="row" spacing={1.5} alignItems="center">
                    <Avatar sx={{ width: 32, height: 32, fontSize: 13, bgcolor: "primary.main" }}>
                      {user.fullName.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography variant="body2" fontWeight={600}>{user.fullName}</Typography>
                      {user.designation && (
                        <Typography variant="caption" color="text.secondary">{user.designation}</Typography>
                      )}
                    </Box>
                  </Stack>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" color="text.secondary" fontFamily="monospace">{user.id}</Typography>
                </TableCell>
                {selectedCompany === "ALL" && (
                  <TableCell>
                    <Typography variant="body2">{companyName(user.companyId)}</Typography>
                  </TableCell>
                )}
                <TableCell>{user.department}</TableCell>
                <TableCell>
                  <Chip size="small" label={user.role.replace("_", " ")} color={roleColor(user.role)} variant="outlined" />
                </TableCell>
                <TableCell>
                  <Chip size="small" label={`Level ${user.currentLevel}`} color={levelColor(user.currentLevel)} />
                </TableCell>
                <TableCell>
                  <Chip
                    size="small"
                    label={user.status ?? "ACTIVE"}
                    color={user.status === "INACTIVE" ? "error" : "success"}
                    variant="outlined"
                  />
                </TableCell>
                <TableCell align="right">
                  <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                    <Tooltip title="Reset Password">
                      <IconButton size="small"><LockResetIcon fontSize="small" /></IconButton>
                    </Tooltip>
                    <Tooltip title={user.status === "INACTIVE" ? "Activate" : "Deactivate"}>
                      <IconButton
                        size="small"
                        color={user.status === "INACTIVE" ? "success" : "error"}
                        onClick={() => updateEmployee(user.id, { status: user.status === "INACTIVE" ? "ACTIVE" : "INACTIVE" })}
                      >
                        {user.status === "INACTIVE" ? <CheckCircleOutlineIcon fontSize="small" /> : <BlockIcon fontSize="small" />}
                      </IconButton>
                    </Tooltip>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
            {visibleUsers.length === 0 && (
              <TableRow>
                <TableCell colSpan={8} align="center">
                  <Typography variant="body2" color="text.secondary" sx={{ py: 3 }}>
                    No employees found.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <Divider />
        <Box sx={{ px: 2, py: 1.5 }}>
          <Typography variant="caption" color="text.secondary">
            Showing {visibleUsers.length} of {users.length} employees
          </Typography>
        </Box>
      </Card>

      {/* Add Employee Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Employee</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid size={{ xs: 12 }}>
              <TextField
                select fullWidth size="small" label="Company"
                value={form.companyId}
                onChange={(e) => setForm((f) => ({ ...f, companyId: e.target.value }))}
              >
                {companies.map((c) => <MenuItem key={c.id} value={c.id}>{c.name}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid size={{ xs: 6 }}>
              <TextField fullWidth size="small" label="Full Name" value={form.fullName}
                onChange={(e) => setForm((f) => ({ ...f, fullName: e.target.value }))} />
            </Grid>
            <Grid size={{ xs: 6 }}>
              <TextField fullWidth size="small" label="Designation" value={form.designation ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, designation: e.target.value }))} />
            </Grid>
            <Grid size={{ xs: 6 }}>
              <TextField fullWidth size="small" label="Email" type="email" value={form.email ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))} />
            </Grid>
            <Grid size={{ xs: 6 }}>
              <TextField fullWidth size="small" label="Mobile" value={form.mobile ?? ""}
                onChange={(e) => setForm((f) => ({ ...f, mobile: e.target.value }))} />
            </Grid>
            <Grid size={{ xs: 6 }}>
              <TextField select fullWidth size="small" label="Department" value={form.department}
                onChange={(e) => setForm((f) => ({ ...f, department: e.target.value }))}
              >
                {DEPARTMENTS.map((d) => <MenuItem key={d} value={d}>{d}</MenuItem>)}
              </TextField>
            </Grid>
            <Grid size={{ xs: 6 }}>
              <TextField select fullWidth size="small" label="Role" value={form.role}
                onChange={(e) => setForm((f) => ({ ...f, role: e.target.value as UserProfile["role"] }))}
              >
                <MenuItem value="EMPLOYEE">Employee</MenuItem>
                <MenuItem value="ADMIN">Admin</MenuItem>
              </TextField>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleAdd} disabled={!form.fullName || !form.companyId}>
            Add Employee
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default UserManagementPage;
