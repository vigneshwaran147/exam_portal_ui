import { createTheme, alpha } from "@mui/material";

import { createTheme, alpha } from "@mui/material";

const primary = "#2563EB";
const success = "#16A34A";
const warning = "#F59E0B";
const error = "#DC2626";

export const theme = createTheme({
  palette: {
    mode: "light",
    primary: { main: primary, light: "#60A5FA", dark: "#1D4ED8", contrastText: "#fff" },
    secondary: { main: "#7C3AED", light: "#A78BFA", dark: "#5B21B6", contrastText: "#fff" },
    success: { main: success, light: "#BBF7D0", dark: "#15803D", contrastText: "#fff" },
    warning: { main: warning, light: "#FDE68A", dark: "#D97706", contrastText: "#fff" },
    error: { main: error, light: "#FECACA", dark: "#B91C1C", contrastText: "#fff" },
    info: { main: "#0EA5E9", light: "#BAE6FD", dark: "#0369A1", contrastText: "#fff" },
    background: { default: "#F8FAFC", paper: "#FFFFFF" },
    text: { primary: "#0F172A", secondary: "#64748B" },
    divider: "#E2E8F0",
    grey: {
      50: "#F8FAFC", 100: "#F1F5F9", 200: "#E2E8F0", 300: "#CBD5E1",
      400: "#94A3B8", 500: "#64748B", 600: "#475569", 700: "#334155",
      800: "#1E293B", 900: "#0F172A"
    }
  },
  shape: { borderRadius: 10 },
  typography: {
    fontFamily: '"Inter", "Segoe UI", -apple-system, BlinkMacSystemFont, "Helvetica Neue", Arial, sans-serif',
    h1: { fontWeight: 700, fontSize: "2.25rem", letterSpacing: "-0.03em", lineHeight: 1.2 },
    h2: { fontWeight: 700, fontSize: "1.875rem", letterSpacing: "-0.025em", lineHeight: 1.25 },
    h3: { fontWeight: 700, fontSize: "1.5rem", letterSpacing: "-0.02em", lineHeight: 1.3, color: "#0F172A" },
    h4: { fontWeight: 700, fontSize: "1.25rem", letterSpacing: "-0.015em", lineHeight: 1.35, color: "#0F172A" },
    h5: { fontWeight: 600, fontSize: "1.125rem", letterSpacing: "-0.01em", lineHeight: 1.4 },
    h6: { fontWeight: 600, fontSize: "1rem", letterSpacing: "-0.005em", lineHeight: 1.5 },
    subtitle1: { fontWeight: 600, fontSize: "0.9375rem", lineHeight: 1.5 },
    subtitle2: { fontWeight: 600, fontSize: "0.8125rem", lineHeight: 1.5, color: "#475569" },
    body1: { fontSize: "0.9375rem", lineHeight: 1.6, color: "#334155" },
    body2: { fontSize: "0.875rem", lineHeight: 1.55, color: "#475569" },
    caption: { fontSize: "0.75rem", lineHeight: 1.5, color: "#64748B" },
    button: { textTransform: "none", fontWeight: 600, fontSize: "0.875rem", letterSpacing: "0.005em" }
  },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          borderRadius: 8,
          padding: "7px 16px",
          fontSize: "0.875rem",
          transition: "all 0.15s ease",
          lineHeight: 1.5,
          "&:active": { transform: "scale(0.98)" },
          "&.Mui-disabled": { opacity: 0.5 }
        },
        sizeSmall: { padding: "5px 12px", fontSize: "0.8125rem" },
        sizeLarge: { padding: "11px 24px", fontSize: "1rem" },
        containedPrimary: {
          background: `linear-gradient(135deg, #3B82F6 0%, ${primary} 100%)`,
          boxShadow: `0 1px 3px ${alpha(primary, 0.4)}, 0 1px 2px rgba(0,0,0,0.06)`,
          "&:hover": {
            background: `linear-gradient(135deg, #60A5FA 0%, #2563EB 100%)`,
            boxShadow: `0 4px 12px ${alpha(primary, 0.35)}`,
            transform: "translateY(-1px)"
          }
        },
        containedSuccess: {
          background: `linear-gradient(135deg, #22C55E 0%, ${success} 100%)`,
          boxShadow: `0 1px 3px ${alpha(success, 0.4)}`,
          "&:hover": { boxShadow: `0 4px 12px ${alpha(success, 0.35)}`, transform: "translateY(-1px)" }
        },
        containedError: {
          background: `linear-gradient(135deg, #F87171 0%, ${error} 100%)`,
          boxShadow: `0 1px 3px ${alpha(error, 0.4)}`,
          "&:hover": { boxShadow: `0 4px 12px ${alpha(error, 0.35)}`, transform: "translateY(-1px)" }
        },
        outlined: {
          borderWidth: "1.5px",
          "&:hover": { borderWidth: "1.5px", backgroundColor: alpha(primary, 0.04) }
        },
        outlinedError: { "&:hover": { backgroundColor: alpha(error, 0.04) } }
      }
    },
    MuiCard: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          borderRadius: 14,
          border: "1px solid #E2E8F0",
          boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.03)",
          transition: "box-shadow 0.2s ease, transform 0.2s ease",
          "&:hover": {
            boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
          }
        }
      }
    },
    MuiCardContent: {
      styleOverrides: { root: { padding: "20px", "&:last-child": { paddingBottom: "20px" } } }
    },
    MuiPaper: {
      styleOverrides: {
        root: { backgroundImage: "none" },
        elevation0: { boxShadow: "none" },
        elevation1: { boxShadow: "0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.03)" },
        elevation2: { boxShadow: "0 4px 16px rgba(0,0,0,0.08)" },
        rounded: { borderRadius: 14 }
      }
    },
    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          fontSize: "0.75rem",
          borderRadius: 6,
          height: 26,
          letterSpacing: "0.01em"
        },
        label: { paddingLeft: 10, paddingRight: 10 },
        sizeSmall: { height: 22, fontSize: "0.7rem" }
      }
    },
    MuiAlert: {
      defaultProps: { variant: "standard" },
      styleOverrides: {
        root: {
          borderRadius: 10,
          fontSize: "0.875rem",
          fontWeight: 500,
          alignItems: "center",
          padding: "10px 16px"
        },
        standardInfo: {
          backgroundColor: "#EFF6FF", color: "#1E40AF",
          border: "1px solid #BFDBFE",
          "& .MuiAlert-icon": { color: "#2563EB" }
        },
        standardWarning: {
          backgroundColor: "#FFFBEB", color: "#92400E",
          border: "1px solid #FDE68A",
          "& .MuiAlert-icon": { color: "#D97706" }
        },
        standardError: {
          backgroundColor: "#FEF2F2", color: "#991B1B",
          border: "1px solid #FECACA",
          "& .MuiAlert-icon": { color: "#DC2626" }
        },
        standardSuccess: {
          backgroundColor: "#F0FDF4", color: "#14532D",
          border: "1px solid #BBF7D0",
          "& .MuiAlert-icon": { color: "#16A34A" }
        }
      }
    },
    MuiTextField: {
      defaultProps: { variant: "outlined" },
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            borderRadius: 8,
            fontSize: "0.9375rem",
            backgroundColor: "#FFFFFF",
            transition: "box-shadow 0.15s ease",
            "& fieldset": { borderColor: "#CBD5E1", borderWidth: "1.5px" },
            "&:hover fieldset": { borderColor: "#94A3B8" },
            "&.Mui-focused fieldset": { borderColor: primary, borderWidth: "2px" },
            "&.Mui-focused": { boxShadow: `0 0 0 3px ${alpha(primary, 0.1)}` }
          },
          "& .MuiInputLabel-root": { fontSize: "0.9375rem", color: "#64748B" },
          "& .MuiInputLabel-root.Mui-focused": { color: primary }
        }
      }
    },
    MuiSelect: {
      styleOverrides: {
        outlined: { borderRadius: 8 }
      }
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          transition: "all 0.15s ease",
          "&.Mui-selected": {
            backgroundColor: alpha(primary, 0.1),
            color: primary,
            "&:hover": { backgroundColor: alpha(primary, 0.14) }
          },
          "&:hover": { backgroundColor: alpha(primary, 0.05) }
        }
      }
    },
    MuiAccordion: {
      styleOverrides: {
        root: {
          borderRadius: "10px !important",
          "&:before": { display: "none" },
          boxShadow: "none",
          border: "1px solid #E2E8F0"
        }
      }
    },
    MuiAccordionSummary: {
      styleOverrides: {
        root: { borderRadius: 10, minHeight: "44px !important" },
        content: { margin: "10px 0 !important" }
      }
    },
    MuiDivider: {
      styleOverrides: { root: { borderColor: "#E2E8F0" } }
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: "rgba(255,255,255,0.85)",
          backdropFilter: "blur(12px)",
          WebkitBackdropFilter: "blur(12px)",
          borderBottom: "1px solid #E2E8F0",
          boxShadow: "none",
          color: "#0F172A"
        }
      }
    },
    MuiDrawer: {
      styleOverrides: {
        paper: { borderRight: "1px solid #E2E8F0", boxShadow: "none" }
      }
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 16,
          boxShadow: "0 20px 60px rgba(0,0,0,0.15)"
        }
      }
    },
    MuiDialogTitle: {
      styleOverrides: { root: { fontWeight: 700, fontSize: "1.125rem", padding: "24px 24px 12px" } }
    },
    MuiDialogContent: {
      styleOverrides: { root: { padding: "0 24px 16px" } }
    },
    MuiDialogActions: {
      styleOverrides: { root: { padding: "8px 24px 24px" } }
    },
    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          backgroundColor: "#1E293B", borderRadius: 6, fontSize: "0.75rem",
          fontWeight: 500, padding: "5px 10px"
        },
        arrow: { color: "#1E293B" }
      }
    }
  }
});
