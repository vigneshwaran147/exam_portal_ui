import { Box } from "@mui/material";
import AppRoutes from "./routes/AppRoutes";

function App() {
  return (
    <Box sx={{
    minHeight: "calc(100vh - 32px)",
    p: 2, // 16px in MUI (assuming spacing = 8)
    backgroundColor: "background.default",
    boxSizing: "border-box",
  }}>
      <AppRoutes />
    </Box>
  );
}

export default App;
