import { Box, Button, Divider, TextField, Typography } from "@mui/material";
import Modal from "../../../shared/components/Modal";
import { useTranslation } from "react-i18next";
import { useMutation, useQuery } from "@tanstack/react-query";
import createArticleCategoryMutation from "../../queries/createArticleCategoryMutation";
import { CreateArticleCategoryPayload } from "../../types";
import { useFormik } from "formik";
import * as Yup from "yup";
import Loader from "../../../shared/components/Loader";
import { getCategoriesQueryOptions } from "../../queries/getCategoriesQueryOptions";
import CategoryItem from "../CategoryItem";
import deleteArticleCategoryMutation from "../../queries/deleteArticleCategoryMutation";
import updateArticleCategoryMutation from "../../queries/updateArticleCategoryMutation";
import AddCircleIcon from "@mui/icons-material/AddCircle";

interface Props {
    open: boolean;
    onClose: () => void;
    onSuccess?: () => void;
}

const CreateArticleCategoryModal = ({ onSuccess, ...props }: Props) => {
    const { t } = useTranslation();

    const { mutate: create, isPending } = useMutation({
        mutationFn: createArticleCategoryMutation,
        onSuccess,
    });

    const { mutate: deleteCategory } = useMutation({
        mutationFn: deleteArticleCategoryMutation,
        onSuccess,
    });

    const { mutate: editCategory } = useMutation({
        mutationFn: updateArticleCategoryMutation,
        onSuccess,
    });

    const { mutate: toggleCategory } = useMutation({
        mutationFn: deleteArticleCategoryMutation,
        onSuccess,
    });

    const { data } = useQuery(getCategoriesQueryOptions());

    const formik = useFormik<CreateArticleCategoryPayload>({
        initialValues: {
            name: "",
        },
        validationSchema: Yup.object({
            name: Yup.string()
                .min(3, t("validation.min_length", { count: 3 }))
                .required(t("validation.required")),
        }),
        onSubmit: (values) => {
            create(values);
            props.onClose();
            formik.resetForm();
        },
    });

    return (
        <Modal
            modalContentProps={{
                width: "100%",
                maxWidth: "800px",
            }}
            {...props}
            title={t("articles.create_new_category.title")}
        >
            <Box width="100%">
                <Box
                    sx={{
                        width: "100%",
                        display: "flex",
                        gap: "20px",
                        alignItems: "center",
                    }}
                    component="form"
                    onSubmit={formik.handleSubmit}
                >
                    {isPending ? (
                        <Loader />
                    ) : (
                        <TextField
                            fullWidth
                            label={t("articles.create_new_category.name_label")}
                            name="name"
                            disabled={isPending}
                            value={formik.values.name}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            error={
                                formik.touched.name &&
                                Boolean(formik.errors.name)
                            }
                            helperText={
                                formik.touched.name && formik.errors.name
                            }
                            margin="normal"
                        />
                    )}
                    <Box
                        marginTop={1}
                        display="flex"
                        justifyContent="flex-end"
                        gap="10px"
                    >
                        <Button
                            fullWidth
                            variant="contained"
                            color="primary"
                            type="submit"
                            sx={{
                                gap: "10px",
                            }}
                        >
                            <AddCircleIcon />
                            {t("common.create")}
                        </Button>
                    </Box>
                </Box>
                <Box
                    sx={{
                        margin: "30px 0 20px 0",
                    }}
                >
                    <Typography
                        color="textSecondary"
                        sx={{
                            fontWeight: "bold",
                            marginBottom: "10px",
                        }}
                    >
                        {t("articles.create_new_category.category_list_title")}
                    </Typography>
                    <Divider />
                </Box>
                <Box
                    sx={{
                        maxHeight: "450px",
                        overflowY: "auto",

                        gap: "10px",
                        display: "flex",
                        flexDirection: "column",
                    }}
                >
                    {data &&
                        data.items.map((category) => (
                            <CategoryItem
                                key={category.id}
                                category={category}
                                onDelete={(id) => deleteCategory({ id })}
                                onEdit={(newCategory) =>
                                    editCategory({
                                        id: newCategory.id,
                                        name: newCategory.name,
                                    })
                                }
                                onToggleActive={(id) => toggleCategory({ id })}
                            />
                        ))}
                </Box>
            </Box>
        </Modal>
    );
};

export default CreateArticleCategoryModal;
