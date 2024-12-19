import { Box, BoxProps, Button, Typography } from "@mui/material";
import { FormResponse, MenteeForm, VolunteerForm } from "../../types";
import UserTableItem from "../../../users/components/UserTableItem";
import useTheme from "../../../../theme";
import { useNavigate } from "react-router-dom";
import CheckBoxIcon from "@mui/icons-material/CheckBox";
import DeleteIcon from "@mui/icons-material/Delete";

interface Props extends BoxProps {
    form: FormResponse<MenteeForm | VolunteerForm>;
}

const FormTableItem = ({ form, ...props }: Props) => {
    const theme = useTheme();
    const navigate = useNavigate();

    const formFieldsRenderer = (fields: MenteeForm | VolunteerForm) => {
        return Object.keys(fields).map((key) => {
            return (
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
                        {key}
                    </Typography>
                    <Typography
                        sx={{
                            fontSize: "20px",
                        }}
                    >
                        0
                    </Typography>
                </Box>
            );
        });
    };

    return (
        <Box {...props}>
            <Box
                sx={{
                    padding: "10px",
                    backgroundColor: theme.palette.background.paper,
                    border: `2px solid ${theme.palette.colors.border}`,
                    borderRadius: "8px",
                    boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.15)",
                }}
            >
                <UserTableItem
                    sx={{
                        padding: "15px",
                    }}
                    user={form.created_by}
                    onEdit={() =>
                        navigate(`/admin/users?search=${form.created_by.email}`)
                    }
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
                </Box>
                <Box
                    sx={{
                        marginTop: "15px",
                        display: "flex",
                        gap: "10px",
                    }}
                >
                    <Button
                        sx={{
                            gap: "10px",
                        }}
                        variant="contained"
                        fullWidth
                    >
                        <CheckBoxIcon />
                        Zaakceptuj
                    </Button>
                    <Button
                        sx={{
                            gap: "10px",
                            borderColor: theme.palette.error.main,
                            color: theme.palette.error.main,
                        }}
                        variant="outlined"
                        fullWidth
                    >
                        <DeleteIcon />
                        Odrzuć
                    </Button>
                </Box>
            </Box>
        </Box>
    );
};

export default FormTableItem;
