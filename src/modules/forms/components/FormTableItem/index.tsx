import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import formatDate from "../../../shared/helpers/formatDate";
import { createRenderFieldValue } from "../../../shared/helpers/formRenderers/formRenderer";
import { arrayOfIsoDatesPlugin } from "../../../shared/helpers/formRenderers/plugins/arrayOfIsoDatesPlugin";
import { arrayOfNamedObjectsPlugin } from "../../../shared/helpers/formRenderers/plugins/arrayOfNamedObjectsPlugin";
import { booleanPlugin } from "../../../shared/helpers/formRenderers/plugins/booleanPlugin";
import { singleIsoDatePlugin } from "../../../shared/helpers/formRenderers/plugins/singleIsoDatePlugin";
import UserTableItem from "../../../users/components/UserTableItem";
import { FormResponse, MenteeForm, VolunteerForm } from "../../types";

interface Props extends React.HTMLAttributes<HTMLDivElement> {
    form?: FormResponse<MenteeForm | VolunteerForm> | null;
    refetch?: () => void;
}

const FormTableItem = ({ form, className, ...props }: Props) => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    const renderFieldValue = createRenderFieldValue([
        arrayOfNamedObjectsPlugin,
        arrayOfIsoDatesPlugin,
        singleIsoDatePlugin,
        booleanPlugin,
    ]);

    if (!form || !form.fields) {
        return null;
    }

    const fieldsArray = Object.entries(form.fields);

    const renderFormFieldValue = (key: string, value: unknown) => {
        if (key === "contact_preference" && typeof value === "string") {
            return t(`form.mentee.contact_preference_options.${value}.title`, { defaultValue: value });
        }

        return renderFieldValue(value);
    };

    return (
        <div className={cn(className)} {...props}>
            <div className="p-5">
                <UserTableItem
                    user={form.created_by}
                    onEdit={() => navigate(`/admin/users?search=${form.created_by.email}`)}
                />

                <Separator className="my-4" />

                <div className="flex flex-col gap-4">
                    {fieldsArray.map(([key, value]) => (
                        <div
                            key={key}
                            className="border-border-brand bg-bg-brand flex flex-col rounded-[10px] border px-[18px] py-[14px]"
                        >
                            <p className="mb-1.5 text-base font-semibold">{t(`forms_fields.${key}`)}</p>
                            <p className="text-base">{renderFormFieldValue(key, value as unknown)}</p>
                        </div>
                    ))}

                    <div className="border-border-brand bg-bg-brand rounded-[10px] border px-[18px] py-[14px]">
                        <p className="mb-1.5 text-base font-semibold">{t(`forms_fields.creation_date`)}</p>
                        <p className="text-base">{formatDate(new Date(form.creation_date), "dd/MM/yyyy")}</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FormTableItem;
