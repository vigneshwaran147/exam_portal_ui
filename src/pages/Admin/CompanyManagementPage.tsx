import {
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
  MenuItem,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import BlockIcon from "@mui/icons-material/Block";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import BusinessIcon from "@mui/icons-material/Business";
import PeopleIcon from "@mui/icons-material/People";
import SchoolIcon from "@mui/icons-material/School";
import SettingsIcon from "@mui/icons-material/Settings";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PageHeader from "@/components/common/PageHeader";
import { usePortal } from "@/hooks/usePortal";
import type { Company } from "@/types/auth";

const INDUSTRIES = [
  "Information Technology",
  "Banking & Finance",
  "Healthcare",
  "Manufacturing",
  "Retail",
  "Telecommunications",
  "Education",
  "Government",
  "Other",
];

const emptyForm: Omit<Company, "id" | "createdAt"> = {
  code: "",
  name: "",
  industry: "Information Technology",
  contactPerson: "",
  email: "",
  phone: "",
  country: "India",
  city: "",
  status: "ACTIVE",
  maxExamLevels: 3,
  passPercentage: 70,
  cameraRequired: true,
  micRequired: true,
  screenShareRequired: true,
  aiMonitoringEnabled: true,
};

function CompanyManagementPage() {
  const { companies, users, addCompany, updateCompany } = usePortal();
  const navigate = useNavigate();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<Company | null>(null);
  const [form, setForm] = useState(emptyForm);

  const openAdd = () => {
    setEditTarget(null);
    setForm(emptyForm);
    setDialogOpen(true);
  };

  const openEdit = (company: Company) => {
    setEditTarget(company);
    const { id: _id, createdAt: _ca, ...rest } = company;
    setForm(rest);
    setDialogOpen(true);
  };

  const handleSave = () => {
    if (editTarget) {
      updateCompany(editTarget.id, form);
    } else {
      addCompany(form);
    }
    setDialogOpen(false);
  };

  const toggleStatus = (company: Company) => {
    updateCompany(company.id, {
      status: company.status === "ACTIVE" ? "INACTIVE" : "ACTIVE",
    });
  };

  const employeeCountFor = (companyId: string) =>
    users.filter((u) => u.companyId === companyId && u.role === "EMPLOYEE").length;

  const activeCount = companies.filter((c) => c.status === "ACTIVE").length;
  const inactiveCount = companies.filter((c) => c.status !== "ACTIVE").length;

  const field = (key: keyof typeof form, label: string, type?: string, options?: string[]) => (
    options ? (
      <TextField
        select fullWidth size="small" label={label}
        value={form[key] as string}
        onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
      >
        {options.map((o) => <MenuItem key={o} value={o}>{o}</MenuItem>)}
      </TextField>
    ) : (
      <TextField
        fullWidth size="small" label={label} type={type ?? "text"}
        value={form[key] as string | number}
        onChange={(e) => setForm((f) => ({ ...f, [key]: type === "number" ? Number(e.target.value) : e.target.value }))}
      />
    )
  );

  return (
    <>
      <PageHeader
        title="Company Management"
        subtitle="Onboard companies and configure exam rules per organisation"
        action={
          <Button variant="contained" size="small" startIcon={<AddIcon />} onClick={openAdd}>
            Add Company
          </Button>
        }
      />

      {/* Summary */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {[
          { label: "Total Companies", value: companies.length, icon: <BusinessIcon />, bg: "#EFF6FF" },
          { label: "Active", value: activeCount, icon: <CheckCircleOutlineIcon />, bg: "#F0FDF4" },
          { label: "Inactive", value: inactiveCount, icon: <BlockIcon />, bg: "#FEF2F2" },
        ].map((item) => (
          <Grid key={item.label} size={{ xs: 12, sm: 4 }}>
            <Card elevation={0} sx={{ border: "1px solid", borderColor: "divider" }}>
              <CardContent>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Box sx={{ p: 1.5, bgcolor: item.bg, borderRadius: 2, display: "flex" }}>{item.icon}</Box>
                  <Box>
                    <Typography variant="h4" fontWeight={800}>{item.value}</Typography>
                    <Typography variant="body2" color="text.secondary">{item.label}</Typography>
                  </Box>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Company cards */}
      <Grid container spacing={2} sx={{ mb: 3 }}>
        {companies.map((company) => {
          const empCount = employeeCountFor(company.id);
          return (
            <Grid key={company.id} size={{ xs: 12, md: 6, lg: 4 }}>
              <Card
                elevation={0}
                sx={{
                  border: "1px solid",
                  borderColor: company.status === "ACTIVE" ? "divider" : "error.200",
                  height: "100%",
                  opacity: company.status === "INACTIVE" ? 0.7 : 1,
                }}
              >
                <CardContent>
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start" sx={{ mb: 1.5 }}>
                    <Box>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Typography variant="h6" fontWeight={700}>{company.name}</Typography>
                        <Chip
                          size="small"
                          label={company.code}
                          color="primary"
                          variant="outlined"
                          sx={{ fontFamily: "monospace", fontWeight: 700 }}
                        />
                      </Stack>
                      <Typography variant="body2" color="text.secondary">{company.industry}</Typography>
                    </Box>
                    <Chip
                      size="small"
                      label={company.status}
                      color={company.status === "ACTIVE" ? "success" : "error"}
                    />
                  </Stack>

                  <Stack spacing={0.75} sx={{ mb: 2 }}>
                    <Typography variant="body2"><strong>Contact:</strong> {company.contactPerson}</Typography>
                    <Typography variant="body2" color="text.secondary">{company.email} · {company.city}, {company.country}</Typography>
                  </Stack>

                  <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 2 }}>
                    {company.cameraRequired && <Chip size="small" label="Camera" color="info" variant="outlined" />}
                    {company.micRequired && <Chip size="small" label="Mic" color="info" variant="outlined" />}
                    {company.screenShareRequired && <Chip size="small" label="Screen" color="info" variant="outlined" />}
                    {company.aiMonitoringEnabled && <Chip size="small" label="AI Monitor" color="secondary" variant="outlined" />}
                    <Chip size="small" label={`Pass: ${company.passPercentage}%`} variant="outlined" />
                  </Stack>

                  <Divider sx={{ my: 1.5 }} />

                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Stack direction="row" spacing={2}>
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <PeopleIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                        <Typography variant="body2">{empCount} employees</Typography>
                      </Stack>
                      <Stack direction="row" spacing={0.5} alignItems="center">
                        <SchoolIcon sx={{ fontSize: 16, color: "text.secondary" }} />
                        <Typography variant="body2">L0–L{company.maxExamLevels - 1}</Typography>
                      </Stack>
                    </Stack>
                    <Stack direction="row" spacing={0.5}>
                      <Tooltip title="Manage Employees">
                        <IconButton size="small" onClick={() => navigate(`/admin/users?company=${company.id}`)}>
                          <PeopleIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Edit">
                        <IconButton size="small" onClick={() => openEdit(company)}>
                          <EditIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title={company.status === "ACTIVE" ? "Deactivate" : "Activate"}>
                        <IconButton
                          size="small"
                          color={company.status === "ACTIVE" ? "error" : "success"}
                          onClick={() => toggleStatus(company)}
                        >
                          {company.status === "ACTIVE" ? <BlockIcon fontSize="small" /> : <CheckCircleOutlineIcon fontSize="small" />}
                        </IconButton>
                      </Tooltip>
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>

      {/* Company table (compact overview) */}
      <Card elevation={0} sx={{ border: "1px solid", borderColor: "divider" }}>
        <Box sx={{ px: 2, pt: 2, pb: 1 }}>
          <Typography variant="h6" fontWeight={700}>All Companies</Typography>
        </Box>
        <Table size="small">
          <TableHead>
            <TableRow sx={{ bgcolor: "grey.50" }}>
              <TableCell sx={{ fontWeight: 700 }}>Company</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Industry</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Employees</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Pass %</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Levels</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Onboarded</TableCell>
              <TableCell sx={{ fontWeight: 700 }} align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {companies.map((company) => (
              <TableRow key={company.id} hover>
                <TableCell>
                  <Typography variant="body2" fontWeight={600}>{company.name}</Typography>
                  <Typography variant="caption" color="text.secondary" fontFamily="monospace">{company.code}</Typography>
                </TableCell>
                <TableCell>{company.industry}</TableCell>
                <TableCell>{employeeCountFor(company.id)}</TableCell>
                <TableCell>{company.passPercentage}%</TableCell>
                <TableCell>L0–L{company.maxExamLevels - 1}</TableCell>
                <TableCell>
                  <Chip size="small" label={company.status} color={company.status === "ACTIVE" ? "success" : "error"} />
                </TableCell>
                <TableCell>
                  <Typography variant="caption">{company.createdAt}</Typography>
                </TableCell>
                <TableCell align="right">
                  <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                    <Tooltip title="Edit">
                      <IconButton size="small" onClick={() => openEdit(company)}><EditIcon fontSize="small" /></IconButton>
                    </Tooltip>
                    <Tooltip title="Employees">
                      <IconButton size="small" onClick={() => navigate(`/admin/users?company=${company.id}`)}><PeopleIcon fontSize="small" /></IconButton>
                    </Tooltip>
                    <Tooltip title="Settings">
                      <IconButton size="small"><SettingsIcon fontSize="small" /></IconButton>
                    </Tooltip>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Divider />
        <Box sx={{ px: 2, py: 1.5 }}>
          <Typography variant="caption" color="text.secondary">{companies.length} companies registered</Typography>
        </Box>
      </Card>

      {/* Add / Edit Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editTarget ? "Edit Company" : "Onboard New Company"}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid size={{ xs: 6 }}>{field("code", "Company Code")}</Grid>
            <Grid size={{ xs: 6 }}>{field("name", "Company Name")}</Grid>
            <Grid size={{ xs: 12 }}>{field("industry", "Industry", undefined, INDUSTRIES)}</Grid>
            <Grid size={{ xs: 6 }}>{field("contactPerson", "Contact Person")}</Grid>
            <Grid size={{ xs: 6 }}>{field("email", "Email", "email")}</Grid>
            <Grid size={{ xs: 6 }}>{field("phone", "Phone")}</Grid>
            <Grid size={{ xs: 6 }}>{field("city", "City")}</Grid>
            <Grid size={{ xs: 6 }}>{field("country", "Country")}</Grid>
            <Grid size={{ xs: 6 }}>
              {field("status", "Status", undefined, ["ACTIVE", "INACTIVE", "SUSPENDED"])}
            </Grid>
            <Grid size={{ xs: 6 }}>{field("passPercentage", "Pass %", "number")}</Grid>
            <Grid size={{ xs: 6 }}>
              {field("maxExamLevels", "Max Exam Levels", undefined, ["1", "2", "3"])}
            </Grid>
          </Grid>
          <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }} color="text.secondary">Proctoring Rules</Typography>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            {(["cameraRequired", "micRequired", "screenShareRequired", "aiMonitoringEnabled"] as const).map((key) => (
              <Chip
                key={key}
                label={key.replace(/([A-Z])/g, " $1").replace("Required", "").trim()}
                color={form[key] ? "primary" : "default"}
                variant={form[key] ? "filled" : "outlined"}
                onClick={() => setForm((f) => ({ ...f, [key]: !f[key] }))}
                sx={{ cursor: "pointer" }}
              />
            ))}
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave} disabled={!form.name || !form.code}>
            {editTarget ? "Save Changes" : "Onboard Company"}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default CompanyManagementPage;
