import { Box, Card, CardContent, Typography } from "@mui/material";
import type { ReactNode } from "react";

type StatCardProps = {
  label: string;
  value: string;
  icon?: ReactNode;
  color?: string;
  sublabel?: string;
};

function StatCard({ label, value, icon, color = "#2563EB", sublabel }: StatCardProps) {
  return (
    <Card
      elevation={0}
      sx={{
        border: "1px solid #E2E8F0",
        transition: "box-shadow 0.2s ease, transform 0.2s ease",
        "&:hover": { boxShadow: "0 4px 20px rgba(0,0,0,0.08)", transform: "translateY(-2px)" },
        height: "100%"
      }}
    >
      <CardContent sx={{ p: "20px !important" }}>
        <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", mb: 1.5 }}>
          <Typography variant="caption" sx={{ fontWeight: 600, color: "text.secondary", textTransform: "uppercase", letterSpacing: "0.06em", fontSize: "0.7rem" }}>
            {label}
          </Typography>
          {icon && (
            <Box sx={{ p: 0.75, borderRadius: 2, bgcolor: `${color}18`, color, display: "flex" }}>
              {icon}
            </Box>
          )}
        </Box>
        <Typography variant="h4" sx={{ fontWeight: 700, color: "text.primary", lineHeight: 1 }}>
          {value}
        </Typography>
        {sublabel && (
          <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: "block" }}>
            {sublabel}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
}

export default StatCard;
