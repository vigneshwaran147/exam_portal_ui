import { Button, Paper, Stack, Typography } from "@mui/material";
import PageHeader from "@/components/common/PageHeader";
import { usePortal } from "@/hooks/usePortal";

function CertificatePage() {
  const { currentUser } = usePortal();
  const canDownload = (currentUser?.currentLevel ?? 0) >= 2;

  return (
    <>
      <PageHeader title="Certificate" subtitle="Download final completion certificate after Level 2 pass" />
      <Paper elevation={0} sx={{ p: 3, border: "1px solid", borderColor: "divider" }}>
        <Stack spacing={2} alignItems="flex-start">
          <Typography>
            {canDownload
              ? "Congratulations. You have unlocked certificate generation."
              : "Certificate generation will be enabled after successful completion of all levels."}
          </Typography>
          <Button variant="contained" disabled={!canDownload}>
            {canDownload ? "Download Certificate" : "Locked"}
          </Button>
        </Stack>
      </Paper>
    </>
  );
}

export default CertificatePage;
