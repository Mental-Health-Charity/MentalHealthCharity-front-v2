import { Button } from "@/components/ui/button";
import { MDXEditorMethods } from "@mdxeditor/editor";
import { useFormik } from "formik";
import { useRef } from "react";
import { useTranslation } from "react-i18next";
import Markdown from "../../../shared/components/Markdown";
import SimpleCard from "../../../shared/components/SimpleCard";

interface Props {
    content: string;
    isOwner: boolean;
    onSubmit: (values: { description: string }) => void;
}

const UserProfileDescription = ({ content, isOwner, onSubmit }: Props) => {
    const { t } = useTranslation();
    const editorRef = useRef<MDXEditorMethods>(null);

    const formik = useFormik({
        initialValues: { description: content },
        onSubmit,
    });

    return (
        <SimpleCard subtitle={t("profile.description_subtitle")} className="flex flex-col gap-2.5">
            {isOwner ? (
                <form onSubmit={formik.handleSubmit}>
                    <div className="relative z-[99999] block min-h-[600px]" onClick={() => editorRef.current?.focus()}>
                        <Markdown
                            ref={editorRef}
                            onChange={(markdown) => formik.setFieldValue("description", markdown)}
                            readOnly={!isOwner}
                            content={formik.values.description}
                            placeholder={t("profile.description_placeholder")}
                        />
                    </div>
                    {formik.dirty && (
                        <div className="flex gap-2.5">
                            <Button type="submit">{t("common.save")}</Button>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => {
                                    formik.resetForm();
                                    editorRef.current?.setMarkdown(content);
                                }}
                            >
                                {t("common.cancel")}
                            </Button>
                        </div>
                    )}
                </form>
            ) : (
                <Markdown
                    readOnly={!isOwner}
                    content={content.length ? content : t("profile.empty_description_placeholder")}
                />
            )}
        </SimpleCard>
    );
};

export default UserProfileDescription;
