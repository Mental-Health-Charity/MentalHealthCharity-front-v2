import { useTranslation } from "react-i18next";
import AdminLayout from "../modules/shared/components/AdminLayout";
import SimpleCard from "../modules/shared/components/SimpleCard";
import { Box } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { getFormsQueryOptions } from "../modules/forms/queries/getFormsQueryOptions";
import { formStatus, formTypes } from "../modules/forms/types";
import WindowListVirtualizer from "../modules/shared/components/WindowListVirtualizer";
import { ListRowProps } from "react-virtualized";
import FormTableItem from "../modules/forms/components/FormTableItem";

const ManageMenteeFormsScreen = () => {
    const { t } = useTranslation();
    const { data, refetch } = useQuery(
        getFormsQueryOptions({
            form_status: formStatus.WAITED,
            form_type_id: formTypes.MENTEE,
            page: 1,
            size: 100,
        })
    );

    const onRender = ({ index, key, style }: ListRowProps) => {
        const user = data && data.items[index];
        if (!user) return null;

        return (
            <FormTableItem
                refetch={refetch}
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
                title={t("manage_mentee_forms.title")}
                subtitle={t("manage_mentee_forms.subtitle")}
            />
            <Box
                sx={{
                    minHeight: "100vh",
                }}
            >
                <WindowListVirtualizer
                    rowHeight={600}
                    onRender={onRender}
                    rowCount={data ? data.items.length : 0}
                />
            </Box>
        </AdminLayout>
    );
};

export default ManageMenteeFormsScreen;
