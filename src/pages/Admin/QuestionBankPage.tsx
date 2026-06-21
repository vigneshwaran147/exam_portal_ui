import {
  Box,
  Button,
  Card,
  Chip,
  Divider,
  Grid,
  InputAdornment,
  MenuItem,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useState } from "react";
import PageHeader from "@/components/common/PageHeader";
import { usePortal } from "@/hooks/usePortal";


const TYPE_LABELS: Record<string, string> = {
  MCQ: "Multiple Choice",
  MULTI_SELECT: "Multi-Select",
  TRUE_FALSE: "True / False",
  FILL_BLANK: "Fill in Blank",
  DESCRIPTIVE: "Descriptive",
  CODING: "Coding",
};

function QuestionBankPage() {
  const { exams } = usePortal();
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("ALL");
  const [filterLevel, setFilterLevel] = useState("ALL");

  const allQuestions = exams.flatMap((exam) =>
    exam.questions.map((q) => ({ ...q, examTitle: exam.title, examLevel: exam.level }))
  );

  const questionTypes = ["ALL", ...Array.from(new Set(allQuestions.map((q) => q.type)))];

  const filtered = allQuestions.filter((q) => {
    const matchSearch =
      q.questionText.toLowerCase().includes(search.toLowerCase()) ||
      q.examTitle.toLowerCase().includes(search.toLowerCase());
    const matchType = filterType === "ALL" || q.type === filterType;
    const matchLevel = filterLevel === "ALL" || String(q.examLevel) === filterLevel;
    return matchSearch && matchType && matchLevel;
  });

  const typeCounts = allQuestions.reduce<Record<string, number>>((acc, q) => {
    acc[q.type] = (acc[q.type] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <>
      <PageHeader
        title="Question Bank"
        subtitle="Manage categorized questions across levels, formats, and difficulty"
        action={
          <Stack direction="row" spacing={1}>
            <Button variant="outlined" size="small">Bulk Upload</Button>
            <Button variant="contained" size="small">+ Add Question</Button>
          </Stack>
        }
      />

      {/* Type summary pills */}
      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mb: 3 }}>
        <Chip label={`All: ${allQuestions.length}`} color="primary" />
        {Object.entries(typeCounts).map(([type, count]) => (
          <Chip
            key={type}
            label={`${TYPE_LABELS[type] ?? type}: ${count}`}
            variant="outlined"
            onClick={() => setFilterType(type)}
            color={filterType === type ? "primary" : "default"}
          />
        ))}
      </Stack>

      {/* Filters */}
      <Grid container spacing={2} sx={{ mb: 2 }}>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth size="small" placeholder="Search questions…"
            value={search} onChange={(e) => setSearch(e.target.value)}
            InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment> }}
          />
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <TextField select fullWidth size="small" label="Type" value={filterType} onChange={(e) => setFilterType(e.target.value)}>
            {questionTypes.map((t) => <MenuItem key={t} value={t}>{t === "ALL" ? "All Types" : (TYPE_LABELS[t] ?? t)}</MenuItem>)}
          </TextField>
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <TextField select fullWidth size="small" label="Level" value={filterLevel} onChange={(e) => setFilterLevel(e.target.value)}>
            <MenuItem value="ALL">All Levels</MenuItem>
            <MenuItem value="0">Level 0</MenuItem>
            <MenuItem value="1">Level 1</MenuItem>
            <MenuItem value="2">Level 2</MenuItem>
          </TextField>
        </Grid>
      </Grid>

      <Card elevation={0} sx={{ border: "1px solid", borderColor: "divider" }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "grey.50" }}>
              <TableCell sx={{ fontWeight: 700, width: "45%" }}>Question</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Type</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Level</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Marks</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Options</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filtered.map((q) => (
              <TableRow key={q.id} hover>
                <TableCell>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    {q.questionText.length > 100 ? q.questionText.slice(0, 100) + "…" : q.questionText}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">{q.examTitle}</Typography>
                </TableCell>
                <TableCell>
                  <Chip size="small" label={TYPE_LABELS[q.type] ?? q.type} color="primary" variant="outlined" />
                </TableCell>
                <TableCell>
                  <Chip size="small" label={`L${q.examLevel}`} variant="outlined" />
                </TableCell>
                <TableCell>{q.marks}</TableCell>
                <TableCell>{(q.options ?? []).length}</TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} align="center">
                  <Typography variant="body2" color="text.secondary" sx={{ py: 3 }}>
                    No questions match the current filters.
                  </Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <Divider />
        <Box sx={{ px: 2, py: 1.5 }}>
          <Typography variant="caption" color="text.secondary">
            Showing {filtered.length} of {allQuestions.length} questions
          </Typography>
        </Box>
      </Card>
    </>
  );
}

export default QuestionBankPage;
