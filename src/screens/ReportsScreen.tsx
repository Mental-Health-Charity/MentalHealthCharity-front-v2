import { useQuery } from "@tanstack/react-query";
import { getReportsQueryOptions } from "../modules/report/queries/getReportsQueryOptions";
import AdminLayout from "../modules/shared/components/AdminLayout";
import SimpleCard from "../modules/shared/components/SimpleCard";
import { useTranslation } from "react-i18next";
import { Box } from "@mui/material";
import ReportItem from "../modules/report/components/ReportItem";

const ReportsScreen = () => {
    const { data } = useQuery(
        getReportsQueryOptions({
            page: 1,
            size: 100,
            is_considered: false,
        })
    );
    const { t } = useTranslation();

    return (
        <AdminLayout>
            <SimpleCard
                subtitle={t("admin.reports.subtitle", { total: data?.total })}
                title={t("admin.reports.title")}
                text={t("admin.reports.text")}
            />
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    gap: "20px",
                }}
                width="100%"
            >
                {data &&
                    data.items.map((report) => (
                        <ReportItem report={report} key={report.id} />
                    ))}
            </Box>
        </AdminLayout>
    );
};

export default ReportsScreen;
