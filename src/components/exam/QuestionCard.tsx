import {
  Box,
  Checkbox,
  FormControlLabel,
  FormGroup,
  Radio,
  RadioGroup,
  Stack,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography
} from "@mui/material";
import type { ExamQuestion, UserAnswerValue } from "@/types/exam";

type QuestionCardProps = {
  question: ExamQuestion;
  index: number;
  value: UserAnswerValue | undefined;
  onChange: (value: UserAnswerValue) => void;
};

function QuestionCard({ question, index, value, onChange }: QuestionCardProps) {
  const isArray = Array.isArray(value);

  return (
    <Box>
      <Typography variant="overline" color="primary.main">
        Question {index + 1} • {question.type} • {question.marks} marks
      </Typography>
      <Typography variant="h6" sx={{ mt: 0.5, mb: 2 }}>
        {question.questionText}
      </Typography>

      {(question.type === "MCQ" || question.type === "TRUE_FALSE") && question.options ? (
        <RadioGroup value={typeof value === "string" ? value : ""} onChange={(e) => onChange(e.target.value)}>
          {question.options.map((option) => (
            <FormControlLabel key={option} value={option} control={<Radio />} label={option} />
          ))}
        </RadioGroup>
      ) : null}

      {question.type === "MULTI_SELECT" && question.options ? (
        <FormGroup>
          {question.options.map((option) => {
            const checked = isArray ? value.includes(option) : false;
            return (
              <FormControlLabel
                key={option}
                control={<Checkbox checked={checked} />}
                label={option}
                onChange={(_, checkedState) => {
                  const current = isArray ? [...value] : [];
                  if (checkedState) {
                    onChange([...current, option]);
                  } else {
                    onChange(current.filter((item) => item !== option));
                  }
                }}
              />
            );
          })}
        </FormGroup>
      ) : null}

      {(question.type === "DESCRIPTIVE" || question.type === "CASE_STUDY") && (
        <TextField
          multiline
          minRows={6}
          fullWidth
          placeholder="Type your answer here"
          value={typeof value === "string" ? value : ""}
          onChange={(e) => onChange(e.target.value)}
        />
      )}

      {question.type === "FILL_BLANK" && (
        <TextField
          fullWidth
          placeholder="Enter your answer"
          value={typeof value === "string" ? value : ""}
          onChange={(e) => onChange(e.target.value)}
        />
      )}

      {question.type === "MULTI_SELECT" && (
        <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
          <ToggleButtonGroup
            value={isArray ? value : []}
            onChange={(_, selected) => onChange(selected)}
            size="small"
          >
            <ToggleButton value="review-hint" disabled>
              Multi-select active
            </ToggleButton>
          </ToggleButtonGroup>
        </Stack>
      )}
    </Box>
  );
}

export default QuestionCard;
