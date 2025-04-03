import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { Box, Button, MenuItem, Select, Typography } from "@mui/material";
import "@silevis/reactgrid/styles.css";
import { useQuery } from "@tanstack/react-query";
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
            <Box display="flex" gap={2} mb={2}>
                {Object.keys(formStatus).map((option) => (
                    <Button
                        key={option}
                        sx={{
                            backgroundColor: "primary.main",
                            color: "white",
                            opacity: option === status ? 1 : 0.5,
                        }}
                        onClick={() => setStatus(option as formStatus)}
                    >
                        <FilterAltIcon />
                        {translatedFormStatus[option as formStatus]}
                    </Button>
                ))}
                <Select value={sort}>
                    {Object.values(formSorting).map((option) => (
                        <MenuItem key={option} value={option} onClick={() => setSort(option)}>
                            {translateFormSorting[option]}
                        </MenuItem>
                    ))}
                </Select>
            </Box>
            {isLoading && <Loader />}
            <Box
                sx={{
                    width: "100%",
                    maxWidth: {
                        xs: "100%",
                        md: "calc(100vw - 240px)",
                    },
                    overflowX: "auto",
                }}
            >
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
            </Box>
            {isError && <Typography color="error">{t("common.no_data")}</Typography>}
        </AdminLayout>
    );
};

export default ManageVolunteerFormsScreen;
