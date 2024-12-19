import { Box, Button } from "@mui/material";
import SimpleCard from "../SimpleCard";
import { useUser } from "../../../auth/components/AuthProvider";
import { useQuery } from "@tanstack/react-query";
import { getReportsQueryOptions } from "../../../report/queries/getReportsQueryOptions";
import ReportItem from "../../../report/components/ReportItem";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import SearchUser from "../../../users/components/SearchUser";
import { useState } from "react";
import { User } from "../../../auth/types";

const Dashboard = () => {
    const { user } = useUser();
    const { data } = useQuery(
        getReportsQueryOptions({
            page: 1,
            size: 100,
            is_considered: false,
        })
    );
    const [quickSearchUser, setQuickSearchUser] = useState<User>();

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
                    <SearchUser
                        value={quickSearchUser}
                        onChange={(user) => setQuickSearchUser(user)}
                    />
                    {quickSearchUser && <p>{quickSearchUser.full_name}</p>}
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
                    {data &&
                        data.items
                            .slice(0, 3)
                            .map((report) => (
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
                        href="/admin/reports"
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
