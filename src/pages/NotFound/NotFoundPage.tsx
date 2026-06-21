import { Box, Button, Typography } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";

function NotFoundPage() {
  return (
    <Box sx={{ minHeight: "100vh", display: "grid", placeItems: "center", p: 3 }}>
      <Box sx={{ textAlign: "center" }}>
        <Typography variant="h4" gutterBottom>
          404 - Page Not Found
        </Typography>
        <Typography color="text.secondary" sx={{ mb: 2 }}>
          The page you are looking for does not exist.
        </Typography>
        <Button component={RouterLink} to="/dashboard" variant="contained">
          Back to Dashboard
        </Button>
      </Box>
    </Box>
  );
}

export default NotFoundPage;
