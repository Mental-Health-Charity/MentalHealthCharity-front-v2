import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useFormik } from "formik";
import { PlusCircle } from "lucide-react";
import { useTranslation } from "react-i18next";
import * as Yup from "yup";
import Loader from "../../../shared/components/Loader";
import Modal from "../../../shared/components/Modal";
import createArticleCategoryMutation from "../../queries/createArticleCategoryMutation";
import deleteArticleCategoryMutation from "../../queries/deleteArticleCategoryMutation";
import { getCategoriesQueryOptions } from "../../queries/getCategoriesQueryOptions";
import updateArticleCategoryMutation from "../../queries/updateArticleCategoryMutation";
import { CreateArticleCategoryPayload } from "../../types";
import CategoryItem from "../CategoryItem";

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
        <Modal className="sm:max-w-[800px]" {...props} title={t("articles.create_new_category.title")}>
            <div className="w-full">
                <form className="flex w-full items-center gap-5" onSubmit={formik.handleSubmit}>
                    {isPending ? (
                        <Loader />
                    ) : (
                        <div className="w-full space-y-1.5">
                            <Label htmlFor="name">{t("articles.create_new_category.name_label")}</Label>
                            <Input
                                id="name"
                                name="name"
                                disabled={isPending}
                                value={formik.values.name}
                                onChange={formik.handleChange}
                                onBlur={formik.handleBlur}
                            />
                            {formik.touched.name && formik.errors.name && (
                                <p className="text-destructive text-sm">{formik.errors.name}</p>
                            )}
                        </div>
                    )}
                    <div className="mt-1 flex justify-end gap-2.5">
                        <Button type="submit" className="gap-2.5">
                            <PlusCircle className="size-5" />
                            {t("common.create")}
                        </Button>
                    </div>
                </form>
                <div className="my-5 mb-5">
                    <p className="text-foreground mb-2.5 font-bold">
                        {t("articles.create_new_category.category_list_title")}
                    </p>
                    <Separator />
                </div>
                <div className="flex max-h-[450px] flex-col gap-2.5 overflow-y-auto">
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
                </div>
            </div>
        </Modal>
    );
};

export default CreateArticleCategoryModal;
