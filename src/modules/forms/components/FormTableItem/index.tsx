import { Box, BoxProps, Divider, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import useTheme from "../../../../theme";
import formatDate from "../../../shared/helpers/formatDate";
import { createRenderFieldValue } from "../../../shared/helpers/formRenderers/formRenderer";
import { arrayOfIsoDatesPlugin } from "../../../shared/helpers/formRenderers/plugins/arrayOfIsoDatesPlugin";
import { arrayOfNamedObjectsPlugin } from "../../../shared/helpers/formRenderers/plugins/arrayOfNamedObjectsPlugin";
import { booleanPlugin } from "../../../shared/helpers/formRenderers/plugins/booleanPlugin";
import { singleIsoDatePlugin } from "../../../shared/helpers/formRenderers/plugins/singleIsoDatePlugin";
import UserTableItem from "../../../users/components/UserTableItem";
import { FormResponse, MenteeForm, VolunteerForm } from "../../types";

interface Props extends BoxProps {
    form: FormResponse<MenteeForm | VolunteerForm>;
    refetch?: () => void;
}

const FormTableItem = ({ form, ...props }: Props) => {
    const theme = useTheme();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const renderFieldValue = createRenderFieldValue([
        arrayOfNamedObjectsPlugin,
        arrayOfIsoDatesPlugin,
        singleIsoDatePlugin,
        booleanPlugin,
    ]);

    const fieldsArray = Object.entries(form.fields);

    return (
        <Box {...props}>
            <Box sx={{ padding: "20px" }}>
                <UserTableItem
                    user={form.created_by}
                    onEdit={() => navigate(`/admin/users?search=${form.created_by.email}`)}
                />

                <Divider sx={{ marginY: 2 }} />

                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    {fieldsArray.map(([key, value]) => (
                        <Box
                            key={key}
                            sx={{
                                padding: "14px 18px",
                                borderRadius: "10px",
                                display: "flex",
                                flexDirection: "column",
                                backgroundColor: theme.palette.background.default,
                                border: `1px solid ${theme.palette.colors.border}`,
                            }}
                        >
                            <Typography
                                sx={{
                                    fontWeight: 600,
                                    fontSize: "16px",
                                    marginBottom: "6px",
                                }}
                            >
                                {t(`forms_fields.${key}`)}
                            </Typography>

                            <Typography sx={{ fontSize: "16px" }}>{renderFieldValue(value as unknown)}</Typography>
                        </Box>
                    ))}

                    <Box
                        sx={{
                            padding: "14px 18px",
                            borderRadius: "10px",
                            backgroundColor: theme.palette.background.default,
                            border: `1px solid ${theme.palette.colors.border}`,
                        }}
                    >
                        <Typography
                            sx={{
                                fontWeight: 600,
                                fontSize: "16px",
                                marginBottom: "6px",
                            }}
                        >
                            {t(`forms_fields.creation_date`)}
                        </Typography>
                        <Typography sx={{ fontSize: "16px" }}>
                            {formatDate(new Date(form.creation_date), "dd/MM/yyyy")}
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default FormTableItem;
