import { useState } from "react";
import {
  AppBar,
  Avatar,
  Box,
  Chip,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
  useTheme,
  Zoom,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import SchoolIcon from "@mui/icons-material/School";
import DashboardIcon from "@mui/icons-material/Dashboard";
import AssessmentIcon from "@mui/icons-material/Assessment";
import MilitaryTechIcon from "@mui/icons-material/MilitaryTech";
import LogoutIcon from "@mui/icons-material/Logout";
import SettingsIcon from "@mui/icons-material/Settings";
import HistoryIcon from "@mui/icons-material/History";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { usePortal } from "@/hooks/usePortal";

const DRAWER_WIDTH = 260;
const COLLAPSED_DRAWER_WIDTH = 65;

function PortalLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { currentUser, logout } = usePortal();
  const user = currentUser;
  const currentLevel = currentUser?.currentLevel ?? 0;
  const navigate = useNavigate();
  const location = useLocation();
  const theme = useTheme();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const navItems = [
    { text: "Dashboard", icon: <DashboardIcon />, path: "/dashboard" },
    { text: "My Exams", icon: <AssessmentIcon />, path: "/exam/instructions" },
    { text: "Certificates", icon: <MilitaryTechIcon />, path: "/certificate" },
    { text: "History", icon: <HistoryIcon />, path: "/history" },
    ...(currentUser?.role !== "EMPLOYEE"
      ? [{ text: "Admin Panel", icon: <SettingsIcon />, path: "/admin/dashboard" }]
      : []),
  ];

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "background.default" }}>
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          bgcolor: "#fff",
          borderBottom: "1px solid",
          borderColor: "grey.100",
          zIndex: (t) => t.zIndex.drawer + 1,
          width: "100%",
          color: "text.primary",
        }}
      >
        <Toolbar sx={{ px: { xs: 1, sm: 2 }, minHeight: 64 }}>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              width: sidebarCollapsed ? COLLAPSED_DRAWER_WIDTH : DRAWER_WIDTH,
              transition: "width 0.2s",
              flexShrink: 0,
            }}
          >
            <IconButton
              edge="start"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              sx={{ mr: 1, color: "text.secondary" }}
            >
              <MenuIcon />
            </IconButton>
            {/* <Zoom in={!sidebarCollapsed}> */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <Box
                  sx={{
                    display: "flex",
                    p: 0.75,
                    bgcolor: "primary.main",
                    borderRadius: 1.5,
                  }}
                >
                  <SchoolIcon sx={{ color: "#fff", fontSize: 20 }} />
                </Box>
                <Typography variant="h6" sx={{ fontWeight: 700, fontSize: "1.1rem" }}>
                  ExamPortal
                </Typography>
              </Box>
            {/* </Zoom> */}
          </Box>
          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            {user?.role === "EMPLOYEE" && (
              <Chip
                label={`Level ${currentLevel}`}
                size="small"
                sx={{
                  fontWeight: 600,
                  bgcolor: "primary.50",
                  color: "primary.main",
                  display: { xs: "none", sm: "flex" },
                }}
              />
            )}
            <Divider orientation="vertical" flexItem sx={{ mx: 1, my: 2 }} />
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, pl: 1 }}>
              <Box sx={{ textAlign: "right", display: { xs: "none", sm: "block" } }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 600, lineHeight: 1.2 }}>
                  {user?.fullName}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {user?.role}
                </Typography>
              </Box>
              <Avatar
                sx={{
                  width: 36,
                  height: 36,
                  bgcolor: "primary.main",
                  fontSize: "0.9rem",
                  fontWeight: 600,
                }}
              >
                {user?.fullName?.charAt(0) || "U"}
              </Avatar>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>

      <Drawer
        variant="permanent"
        sx={{
          width: sidebarCollapsed ? COLLAPSED_DRAWER_WIDTH : DRAWER_WIDTH,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: sidebarCollapsed ? COLLAPSED_DRAWER_WIDTH : DRAWER_WIDTH,
            boxSizing: "border-box",
            bgcolor: "#fff",
            borderRight: "1px solid",
            borderColor: "grey.100",
            transition: theme.transitions.create("width", {
              easing: theme.transitions.easing.sharp,
              duration: theme.transitions.duration.enteringScreen,
            }),
            overflowX: "hidden",
          },
        }}
      >
        <Toolbar sx={{ minHeight: 64 }} />
        <Box
          sx={{
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            height: "100%",
          }}
        >
          <List sx={{ px: sidebarCollapsed ? 1 : 2, pt: 2 }}>
            {navItems.map((item) => {
              const active = location.pathname.startsWith(item.path);
              return (
                <ListItemButton
                  key={item.text}
                  onClick={() => navigate(item.path)}
                  sx={{
                    minHeight: 48,
                    justifyContent: sidebarCollapsed ? "center" : "initial",
                    px: 2.5,
                    mb: 1,
                    borderRadius: 2,
                    bgcolor: active ? "primary.50" : "transparent",
                    color: active ? "primary.main" : "text.secondary",
                    "&:hover": { bgcolor: active ? "primary.50" : "grey.50" },
                  }}
                >
                  <ListItemIcon
                    sx={{
                      minWidth: 0,
                      mr: sidebarCollapsed ? 0 : 2,
                      justifyContent: "center",
                      color: active ? "primary.main" : "inherit",
                    }}
                  >
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.text}
                    sx={{
                      opacity: sidebarCollapsed ? 0 : 1,
                      display: sidebarCollapsed ? "none" : "block",
                      "& .MuiListItemText-primary": {
                        fontWeight: active ? 600 : 500,
                        fontSize: "0.95rem",
                      },
                    }}
                  />
                </ListItemButton>
              );
            })}
          </List>
          <Box sx={{ flexGrow: 1 }} />
          <Divider sx={{ mx: 2, mb: 2 }} />
          <List sx={{ px: sidebarCollapsed ? 1 : 2, pb: 2 }}>
            <ListItemButton
              onClick={handleLogout}
              sx={{
                minHeight: 48,
                justifyContent: sidebarCollapsed ? "center" : "initial",
                px: 2.5,
                borderRadius: 2,
                color: "error.main",
                "&:hover": { bgcolor: "error.50" },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: sidebarCollapsed ? 0 : 2,
                  justifyContent: "center",
                  color: "inherit",
                }}
              >
                <LogoutIcon />
              </ListItemIcon>
              <ListItemText
                primary="Log out"
                sx={{
                  opacity: sidebarCollapsed ? 0 : 1,
                  display: sidebarCollapsed ? "none" : "block",
                  "& .MuiListItemText-primary": {
                    fontWeight: 500,
                    fontSize: "0.95rem",
                  },
                }}
              />
            </ListItemButton>
          </List>
        </Box>
      </Drawer>

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          pt: 8,
          height: "100vh",
          overflow: "auto",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Outlet />
      </Box>
    </Box>
  );
}

export default PortalLayout;
