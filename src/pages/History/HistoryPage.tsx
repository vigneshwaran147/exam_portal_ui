import { Paper, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import PageHeader from "@/components/common/PageHeader";
import { usePortal } from "@/hooks/usePortal";

function HistoryPage() {
  const { currentUser, results } = usePortal();
  const rows = results.filter((result) => result.userId === currentUser?.id);

  return (
    <>
      <PageHeader title="Exam History" subtitle="Review past attempts, scores, and status" />
      <Paper elevation={0} sx={{ border: "1px solid", borderColor: "divider" }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Exam</TableCell>
              <TableCell>Score</TableCell>
              <TableCell>Percentage</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Submitted On</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.examId}</TableCell>
                <TableCell>{row.score}/{row.totalMarks}</TableCell>
                <TableCell>{row.percentage}%</TableCell>
                <TableCell>{row.status}</TableCell>
                <TableCell>{new Date(row.submittedAt).toLocaleString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
      <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5 }}>
        History integrates with Level progression and result publishing workflow.
      </Typography>
    </>
  );
}

export default HistoryPage;
