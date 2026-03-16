import { useTranslation } from "react-i18next";
import SimpleCard from "../../../shared/components/SimpleCard";

interface Props {
    username: string;
    email: string;
}

const UserProfileSettings = ({ email, username }: Props) => {
    const { t } = useTranslation();
    return (
        <SimpleCard subtitle={t("profile.settings_subtitle")} className="flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-muted-foreground text-lg">
                        {t("profile.settings_acc_name", { name: username })}
                    </p>
                    <p className="text-muted-foreground text-lg">{t("profile.settings_acc_email", { email })}</p>
                </div>
            </div>
            <p className="text-lg">{t("profile.this_section_is_private")}</p>
        </SimpleCard>
    );
};

export default UserProfileSettings;
