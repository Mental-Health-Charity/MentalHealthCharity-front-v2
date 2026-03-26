import { Button } from "@/components/ui/button";
import "@silevis/reactgrid/styles.css";
import { useQuery } from "@tanstack/react-query";
import { Filter } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import FormsTable from "../modules/forms/components/FormsTable";
import { translatedFormStatus, translateFormSorting } from "../modules/forms/constants";
import { getFormsQueryOptions } from "../modules/forms/queries/getFormsQueryOptions";
import { formNoteFields, formSorting, formStatus, formTypes } from "../modules/forms/types";
import AdminLayout from "../modules/shared/components/AdminLayout";
import Loader from "../modules/shared/components/Loader";
import SimpleCard from "../modules/shared/components/SimpleCard";

const ManageVolunteerFormsScreen = () => {
    const { t } = useTranslation();
    const [status, setStatus] = useState<formStatus>(formStatus.WAITED);
    const [sort, setSort] = useState<formSorting>(formSorting.MIN_STAGE);

    const { data, isLoading, isError, refetch } = useQuery(
        getFormsQueryOptions({
            form_status: status,
            form_type_id: formTypes.VOLUNTEER,
            sort,
            page: 1,
            size: 100,
        })
    );

    return (
        <AdminLayout>
            <SimpleCard title={t("manage_volunteer_forms.title")} subtitle={t("manage_volunteer_forms.subtitle")} />
            <div className="mt-5 mb-4 flex gap-4">
                {Object.keys(formStatus).map((option) => (
                    <Button
                        key={option}
                        className="text-white"
                        style={{ opacity: option === status ? 1 : 0.5 }}
                        onClick={() => setStatus(option as formStatus)}
                    >
                        <Filter className="size-4" />
                        {translatedFormStatus[option as formStatus]}
                    </Button>
                ))}
                <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value as formSorting)}
                    className="border-input focus-visible:border-ring focus-visible:ring-ring/50 h-8 rounded-lg border bg-transparent px-2.5 py-1 text-sm outline-none focus-visible:ring-3"
                >
                    {Object.values(formSorting).map((option) => (
                        <option key={option} value={option}>
                            {translateFormSorting[option]}
                        </option>
                    ))}
                </select>
            </div>
            {isLoading && <Loader />}
            <div className="w-full overflow-x-auto md:max-w-[calc(100vw-240px)]">
                {data && (
                    <FormsTable
                        formNoteKeys={[
                            formNoteFields.AVAILABILITY,
                            formNoteFields.INTERVIEW_DESCRIPTION,
                            formNoteFields.WORK_AREA,
                        ]}
                        onRefetch={refetch}
                        data={data}
                        renderStepAddnotation={(id) => t(`manage_volunteer_forms.steps.${id - 1}`)}
                    />
                )}
            </div>
            {isError && <p className="text-destructive">{t("common.no_data")}</p>}
        </AdminLayout>
    );
};

export default ManageVolunteerFormsScreen;
