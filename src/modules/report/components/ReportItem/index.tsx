import {
  Box,
  Typography,
  useTheme,
  Card,
  CardContent,
  Button,
  Chip,
} from "@mui/material";
import { Report } from "../../types";
import formatDate from "../../../shared/helpers/formatDate";
import ErrorIcon from "@mui/icons-material/Error";
import { useTranslation } from "react-i18next";
import { ReportTranslationKeys } from "../../constants";

interface Props {
  report: Report;
}

const ReportCard = ({ report }: Props) => {
  const theme = useTheme();
  const { t } = useTranslation();

  return (
    <Card
      sx={{
        backgroundColor: theme.palette.background.paper,
        borderRadius: "10px",
        padding: "0px 20px 20px 20px",
        boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
        border: "2px solid rgba(0, 0, 0, 0.1)",
      }}
    >
      <CardContent
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "20px",
        }}
      >
        <Box sx={{ flexGrow: 1, maxWidth: "800px" }}>
          <Typography
            color="textSecondary"
            variant="h6"
            sx={{ fontWeight: "bold" }}
          >
            {report.subject}
          </Typography>

          <Typography variant="body2" color="textSecondary">
            {report.description}
          </Typography>
        </Box>

        <Box minWidth={200} sx={{ display: "flex", flexDirection: "column" }}>
          <Typography variant="body2" color="textSecondary">
            {formatDate(report.creation_date)}
          </Typography>

          <Typography variant="caption" color="textSecondary">
            Autor: {report.created_by.full_name}
          </Typography>
          <Typography variant="caption" color="textSecondary">
            Email: {report.created_by.email}
          </Typography>
        </Box>
      </CardContent>
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          gap: "10px",
        }}
      >
        <Box
          sx={{
            display: "flex",
            gap: "10px",
          }}
        >
          <Button
            variant="contained"
            sx={{
              padding: "5px 20px",
              fontSize: "16px",
            }}
          >
            Rozstrzygnij
          </Button>
          <Button
            variant="outlined"
            sx={{
              padding: "3px 20px",
              fontSize: "16px",
            }}
          >
            Odrzuć
          </Button>
        </Box>
        <Chip
          label={
            <Box
              sx={{
                display: "flex",
                gap: "10px",
                width: "190px",
              }}
            >
              <ErrorIcon />
              <Typography>
                {t(ReportTranslationKeys[report.report_type])}
              </Typography>
            </Box>
          }
          color="error"
        />
      </Box>
    </Card>
  );
};

export default ReportCard;
