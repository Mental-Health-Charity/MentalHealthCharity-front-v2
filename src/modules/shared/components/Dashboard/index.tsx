import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useUser } from "../../../auth/components/AuthProvider";
import { User } from "../../../auth/types";
import ReportItem from "../../../report/components/ReportItem";
import { getReportsQueryOptions } from "../../../report/queries/getReportsQueryOptions";
import SearchUser from "../../../users/components/SearchUser";
import SimpleCard from "../SimpleCard";

const Dashboard = () => {
    const { user } = useUser();
    const { t } = useTranslation();
    const { data } = useQuery(
        getReportsQueryOptions({
            page: 1,
            size: 100,
            is_considered: false,
        })
    );
    const [quickSearchUser, setQuickSearchUser] = useState<User>();

    return (
        <div className="flex w-full max-w-[1200px] flex-col gap-5">
            <SimpleCard
                subtitle={t("admin.dashboard.welcome", { name: user?.full_name })}
                title={t("admin.dashboard.title")}
                text={t("admin.dashboard.server_status")}
            />
            <SimpleCard subtitle={t("admin.dashboard.search_subtitle")} title={t("admin.dashboard.search_title")}>
                <div className="mt-5 flex w-full flex-col gap-2.5">
                    <SearchUser value={quickSearchUser} onChange={(user) => setQuickSearchUser(user)} />
                    {quickSearchUser && <p className="text-foreground">{quickSearchUser.full_name}</p>}
                </div>
            </SimpleCard>
            <SimpleCard
                subtitle={t("admin.dashboard.reports_subtitle", { count: data?.total ?? 0 })}
                title={t("admin.dashboard.reports_title")}
            >
                <div className="mt-5 flex w-full flex-col gap-2.5">
                    {data && data.items.slice(0, 3).map((report) => <ReportItem report={report} key={report.id} />)}
                </div>
                <div className="mt-5 flex w-full justify-end">
                    <a href="/admin/reports" className="no-underline">
                        <Button variant="ghost" className="gap-2.5">
                            {t("admin.dashboard.check_more")} <ArrowRight className="size-5" />
                        </Button>
                    </a>
                </div>
            </SimpleCard>
        </div>
    );
};

export default Dashboard;
