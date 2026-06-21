import { Alert, Box, Button, Chip, Divider, MenuItem, Stack, TextField, Typography } from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import SchoolIcon from "@mui/icons-material/School";
import ShieldIcon from "@mui/icons-material/Shield";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import type { UserRole } from "@/types/auth";
import { usePortal } from "@/hooks/usePortal";

function LoginPage() {
  const navigate = useNavigate();
  const { login } = usePortal();
  const [employeeId, setEmployeeId] = useState("EMP1001");
  const [password, setPassword] = useState("demo");
  const [selectedRole, setSelectedRole] = useState<UserRole>("EMPLOYEE");
  const [error, setError] = useState<string | null>(null);

  const handleLogin = () => {
    const result = login(employeeId, password, selectedRole);
    if (!result.success) {
      setError(result.message ?? "Login failed");
      return;
    }
    navigate("/dashboard");
  };

  return (
    <Box sx={{minHeight: "calc(100vh - 32px)",  display: "flex", bgcolor: "background.default" }}>
      {/* Left panel */}
      <Box
        sx={{
          display: { xs: "none", md: "flex" },
          flexDirection: "column",
          justifyContent: "space-between",
          flex: 1,
          p: 6,
          bgcolor: "primary.dark",
          position: "relative",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            top: "-20%",
            right: "-15%",
            width: "60%",
            height: "60%",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.06)",
          },
          "&::after": {
            content: '""',
            position: "absolute",
            bottom: "-10%",
            left: "-10%",
            width: "40%",
            height: "40%",
            borderRadius: "50%",
            background: "rgba(255,255,255,0.04)",
          },
        }}
      >
        <Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 8 }}>
            <Box
              sx={{
                p: 1,
                bgcolor: "rgba(255,255,255,0.15)",
                borderRadius: 2,
                display: "flex",
              }}
            >
              <SchoolIcon sx={{ fontSize: 22, color: "#fff" }} />
            </Box>
            <Typography sx={{ fontWeight: 700, color: "#fff", fontSize: "1.1rem" }}>
              ExamPortal
            </Typography>
          </Box>
          <Typography
            sx={{
              fontWeight: 800,
              color: "#fff",
              fontSize: "2.5rem",
              lineHeight: 1.15,
              mb: 2,
              position: "relative",
              zIndex: 1,
            }}
          >
            Enterprise
            <br />
            Assessment
            <br />
            Platform
          </Typography>
          <Typography
            sx={{
              color: "rgba(255,255,255,0.8)",
              fontSize: "1.1rem",
              maxWidth: 400,
              position: "relative",
              zIndex: 1,
            }}
          >
            Secure, scalable, and AI-monitored examination environment for modern
            organizations.
          </Typography>
        </Box>
        <Stack spacing={1.5}>
          {[
            {
              icon: <ShieldIcon sx={{ fontSize: 18 }} />,
              text: "AI-powered proctoring with face & noise detection",
            },
            {
              icon: <VerifiedUserIcon sx={{ fontSize: 18 }} />,
              text: "End-to-end encrypted sessions",
            },
            {
              icon: <LockOutlinedIcon sx={{ fontSize: 18 }} />,
              text: "WCAG 2.1 accessible & enterprise-grade security",
            },
          ].map((item, i) => (
            <Box key={i} sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Box sx={{ color: "rgba(255,255,255,0.65)", flexShrink: 0 }}>
                {item.icon}
              </Box>
              <Typography sx={{ color: "rgba(255,255,255,0.85)", fontSize: "0.875rem" }}>
                {item.text}
              </Typography>
            </Box>
          ))}
        </Stack>
      </Box>

      {/* Right panel */}
      <Box
        sx={{
          flex: { xs: 1, md: 0.8 },
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          p: 4,
        }}
      >
        <Box sx={{ width: "100%", maxWidth: 400 }}>
          {/* Mobile logo */}
          <Box
            sx={{
              display: { xs: "flex", md: "none" },
              alignItems: "center",
              gap: 1.5,
              mb: 4,
              justifyContent: "center",
            }}
          >
            <Box
              sx={{ display: "inline-flex", p: 1.5, bgcolor: "primary.main", borderRadius: 2 }}
            >
              <SchoolIcon sx={{ color: "#fff" }} />
            </Box>
            <Typography variant="h5" sx={{ fontWeight: 700 }}>
              ExamPortal
            </Typography>
          </Box>

          <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.75, letterSpacing: "-0.02em" }}>
            Sign in
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Use your employee credentials to access the portal.
          </Typography>

          <Alert severity="info" sx={{ mb: 3 }}>
            Demo: <strong>EMP1001</strong>, <strong>ADM2001</strong>,{" "}
            <strong>SUP3001</strong> — pass: <strong>demo</strong>
          </Alert>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Stack spacing={2}>
            <TextField
              label="Employee ID"
              value={employeeId}
              onChange={(e) => setEmployeeId(e.target.value)}
              fullWidth
              autoFocus
            />
            <TextField
              select
              label="Role"
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value as UserRole)}
              fullWidth
            >
              <MenuItem value="EMPLOYEE">Employee</MenuItem>
              <MenuItem value="ADMIN">Administrator</MenuItem>
              <MenuItem value="SUPER_ADMIN">Super Administrator</MenuItem>
            </TextField>
            <TextField
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              onKeyDown={(e) => {
                if (e.key === "Enter") handleLogin();
              }}
            />
            <Button
              variant="contained"
              size="large"
              onClick={handleLogin}
              fullWidth
              sx={{ mt: 1, py: 1.5, fontSize: "1rem" }}
            >
              Sign in to Portal
            </Button>
          </Stack>

          <Divider sx={{ my: 4 }}>
            <Typography variant="body2" color="text.secondary">
              Secure Environment
            </Typography>
          </Divider>

          <Stack direction="row" justifyContent="center" flexWrap="wrap" gap={0.5}>
            <Chip size="small" label="Auth + RBAC" color="primary" variant="outlined" />
            <Chip size="small" label="Exam Engine" color="secondary" variant="outlined" />
            <Chip size="small" label="AI Proctoring" color="success" variant="outlined" />
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}

export default LoginPage;
