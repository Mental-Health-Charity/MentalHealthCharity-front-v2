import {
    Box,
    Button,
    Checkbox,
    FormControl,
    FormHelperText,
    InputLabel,
    ListItemText,
    MenuItem,
    Select,
    TextField,
} from "@mui/material";
import { useFormik } from "formik";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";
import { Roles } from "../../../users/constants";
import { CreateChatFormValues } from "../../types";

const FLAG_OPTIONS = [{ value: "autoGroupChat", label: "Automatyczny czat grupowy" }];

const validationSchema = Yup.object({
    name: Yup.string().min(4, "Nazwa musi zawierać co najmniej 4 znaki").required("Nazwa jest wymagana"),
    flags: Yup.array().of(Yup.string()).required("Wybór flagi jest wymagany"),
    role: Yup.string().when("flags", (flags, schema) =>
        flags.includes("autoGroupChat")
            ? schema.required("Wybór roli jest wymagany, gdy wybrano Automatyczny czat grupowy")
            : schema
    ),
});

interface Props {
    onSubmit: (values: CreateChatFormValues) => void;
}

const CreateChatForm = ({ onSubmit }: Props) => {
    const { t } = useTranslation();
    const formik = useFormik<CreateChatFormValues>({
        initialValues: {
            name: "",
            flags: [],
            role: "",
        },
        validationSchema,
        onSubmit,
    });

    return (
        <Box
            component="form"
            onSubmit={formik.handleSubmit}
            noValidate
            sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                width: "400px",
            }}
        >
            <TextField
                fullWidth
                id="name"
                name="name"
                label="Nazwa"
                value={formik.values.name}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.name && Boolean(formik.errors.name)}
                helperText={formik.touched.name && formik.errors.name}
            />

            <FormControl fullWidth error={formik.touched.flags && Boolean(formik.errors.flags)}>
                <InputLabel id="flags-label">Rozszerzenia</InputLabel>
                <Select
                    labelId="flags-label"
                    id="flags"
                    name="flags"
                    multiple
                    value={formik.values.flags}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    renderValue={(selected) =>
                        selected.map((flag) => FLAG_OPTIONS.find((f) => f.value === flag)?.label).join(", ")
                    }
                >
                    {FLAG_OPTIONS.map((option) => (
                        <MenuItem key={option.value} value={option.value}>
                            <Checkbox checked={formik.values.flags.includes(option.value)} />
                            <ListItemText primary={option.label} />
                        </MenuItem>
                    ))}
                </Select>
                {formik.touched.flags && <FormHelperText>{formik.errors.flags}</FormHelperText>}
            </FormControl>

            {formik.values.flags.includes("autoGroupChat") && (
                <FormControl fullWidth error={formik.touched.role && Boolean(formik.errors.role)}>
                    <InputLabel id="role-label">Rola</InputLabel>
                    <Select
                        labelId="role-label"
                        id="role"
                        name="role"
                        value={formik.values.role}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    >
                        {Object.values(Roles).map((role) => (
                            <MenuItem key={role} value={role}>
                                {role}
                            </MenuItem>
                        ))}
                    </Select>
                    {formik.touched.role && <FormHelperText>{formik.errors.role}</FormHelperText>}
                </FormControl>
            )}

            <Button variant="contained" type="submit">
                {t("common.create")}
            </Button>
        </Box>
    );
};

export default CreateChatForm;
