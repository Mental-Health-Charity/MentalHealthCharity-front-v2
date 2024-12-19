import { useTranslation } from "react-i18next";
import AdminLayout from "../modules/shared/components/AdminLayout";
import SimpleCard from "../modules/shared/components/SimpleCard";
import WindowListVirtualizer from "../modules/shared/components/WindowListVirtualizer";
import { Box } from "@mui/material";
import { getFormsQueryOptions } from "../modules/forms/queries/getFormsQueryOptions";
import { useQuery } from "@tanstack/react-query";
import { formStatus, formTypes } from "../modules/forms/types";
import { ListRowProps } from "react-virtualized";
import FormTableItem from "../modules/forms/components/FormTableItem";

const ManageVolunteerFormsScreen = () => {
    const { t } = useTranslation();
    const { data } = useQuery(
        getFormsQueryOptions({
            form_status: formStatus.ACCEPTED,
            form_type_id: formTypes.VOLUNTEER,
            page: 1,
            size: 100,
        })
    );

    const onRender = ({ index, key, style }: ListRowProps) => {
        const user = data && data.items[index];
        if (!user) return null;

        return (
            <FormTableItem
                sx={{
                    ...style,
                }}
                key={key}
                form={data.items[index]}
            />
        );
    };

    return (
        <AdminLayout>
            <SimpleCard
                title={t("manage_volunteer_forms.title")}
                subtitle={t("manage_volunteer_forms.subtitle")}
            />
            <Box
                sx={{
                    minHeight: "100vh",
                }}
            >
                <WindowListVirtualizer
                    rowHeight={680}
                    onRender={onRender}
                    rowCount={data ? data.items.length : 0}
                />
            </Box>
        </AdminLayout>
    );
};

export default ManageVolunteerFormsScreen;
