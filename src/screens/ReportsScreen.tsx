import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import ReportItem from "../modules/report/components/ReportItem";
import { getReportsQueryOptions } from "../modules/report/queries/getReportsQueryOptions";
import AdminLayout from "../modules/shared/components/AdminLayout";
import SimpleCard from "../modules/shared/components/SimpleCard";

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
            <div className="flex w-full flex-col gap-5">
                {data && data.items.map((report) => <ReportItem report={report} key={report.id} />)}
            </div>
        </AdminLayout>
    );
};

export default ReportsScreen;
