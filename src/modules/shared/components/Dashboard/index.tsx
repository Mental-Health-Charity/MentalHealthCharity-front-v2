import { Box, Button, Typography } from "@mui/material";
import SimpleCard from "../SimpleCard";
import { useUser } from "../../../auth/components/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import { getReportsQueryOptions } from "../../../report/queries/getReportsQueryOptions";
import ReportItem from "../../../report/components/ReportItem";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import SearchUser from "../../../users/components/SearchUser";

const Dashboard = () => {
  const { user } = useUser();
  const { data } = useQuery(getReportsQueryOptions());
  return (
    <Box
      sx={{
        width: "100%",
        maxWidth: "1400px",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
      }}
    >
      <SimpleCard
        subtitle={`Witaj ponownie ${user?.full_name}`}
        title="Panel administracyjny Fundacja Peryskop"
        text="Status serwera jest aktywny"
      />
      <SimpleCard
        subtitle="Wyszukiwarka"
        title="Szybkie wyszukiwanie użytkowników"
      >
        <Box
          width="100%"
          marginTop="20px"
          display="flex"
          flexDirection="column"
          gap="10px"
        >
          <SearchUser />
        </Box>
      </SimpleCard>
      <SimpleCard
        subtitle={`Aktywnych zgłoszeń ${data?.total}`}
        title="Zgłoszenia"
      >
        <Box
          width="100%"
          marginTop="20px"
          display="flex"
          flexDirection="column"
          gap="10px"
        >
          {data?.items.slice(0, 3).map((report) => (
            <ReportItem report={report} key={report.id} />
          ))}
        </Box>
        <Box
          sx={{
            marginTop: "20px",
            width: "100%",
            display: "flex",
            justifyContent: "flex-end",
          }}
        >
          <Button
            sx={{
              gap: "10px",
            }}
          >
            Sprawdź więcej <ArrowForwardIcon />
          </Button>
        </Box>
      </SimpleCard>
    </Box>
  );
};

export default Dashboard;
