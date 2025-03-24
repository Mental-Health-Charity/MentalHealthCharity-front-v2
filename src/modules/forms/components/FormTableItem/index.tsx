import { Box, BoxProps, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import useTheme from "../../../../theme";
import formatDate from "../../../shared/helpers/formatDate";
import UserTableItem from "../../../users/components/UserTableItem";
import { FormResponse, MenteeForm, VolunteerForm } from "../../types";

interface Props extends BoxProps {
    form: FormResponse<MenteeForm | VolunteerForm>;
    refetch?: () => void;
}

const FormTableItem = ({ form, refetch, ...props }: Props) => {
    const theme = useTheme();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const formFieldsRenderer = (fields: MenteeForm | VolunteerForm) => {
        return Object.keys(fields).map((key) => {
            const value = fields[key as keyof (MenteeForm | VolunteerForm)];

            const displayValue =
                Array.isArray(value) && value.every((item) => typeof item === "object" && "name" in item)
                    ? value.map((option) => option.name).join(", ")
                    : value;

            return (
                <Box
                    key={key}
                    sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        color: theme.palette.text.secondary,
                        padding: "10px",
                        gap: "10px",
                        border: `1px solid ${theme.palette.colors.border}`,
                    }}
                >
                    <Typography
                        sx={{
                            fontWeight: "bold",
                            fontSize: "20px",
                        }}
                    >
                        {t(`forms_fields.${key}`)}
                    </Typography>
                    <Typography
                        sx={{
                            fontSize: "20px",
                        }}
                    >
                        {(displayValue as string) || "-"}{" "}
                    </Typography>
                </Box>
            );
        });
    };

    return (
        <Box {...props}>
            <Box
                sx={{
                    backgroundColor: theme.palette.background.paper,
                }}
            >
                <UserTableItem
                    sx={{
                        padding: "15px",
                    }}
                    user={form.created_by}
                    onEdit={() => navigate(`/admin/users?search=${form.created_by.email}`)}
                />
                <Box
                    sx={{
                        padding: "1px",
                        marginTop: "10px",
                        width: "100%",
                        borderRadius: "8px",
                    }}
                >
                    {formFieldsRenderer(form.fields)}

                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            color: theme.palette.text.secondary,
                            padding: "10px",
                            border: `1px solid ${theme.palette.colors.border}`,
                        }}
                    >
                        <Typography
                            sx={{
                                fontWeight: "bold",
                                fontSize: "20px",
                            }}
                        >
                            {t(`forms_fields.creation_date`)}
                        </Typography>
                        <Typography
                            sx={{
                                fontSize: "20px",
                            }}
                        >
                            {formatDate(new Date(form.creation_date), "dd/MM/yyyy")}
                        </Typography>
                    </Box>
                </Box>
            </Box>
        </Box>
    );
};

export default FormTableItem;
