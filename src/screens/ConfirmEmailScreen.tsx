import { useTranslation } from "react-i18next";
import { useSearchParams } from "react-router-dom";
import EmailIcon from "../assets/static/email_icon.svg";
import { buildForwardedAuthSearch } from "../modules/auth/helpers/authRedirect";
import { StyledLink } from "../modules/shared/components/StyledLink";

const ConfirmEmailScreen = () => {
    const { t } = useTranslation();
    const [searchParams] = useSearchParams();
    const authSearch = buildForwardedAuthSearch(searchParams);

    return (
        <div className="flex min-h-[90vh] flex-col items-center justify-center gap-10 px-5 py-20">
            <img src={EmailIcon} alt="Email Icon" width={200} height={200} />
            <div className="flex max-w-[600px] flex-col gap-4">
                <h1 className="text-center text-3xl">{t("confirm_email_begin.title")}</h1>
                <p className="text-center opacity-75">{t("confirm_email_begin.description")}</p>
            </div>
            <div className="border-border border-t pt-10 opacity-75">
                <p>
                    {t("confirm_email_begin.footer")}{" "}
                    <StyledLink to={`/auth/register${authSearch}`}>{t("confirm_email_begin.change_email")}</StyledLink>{" "}
                    <StyledLink to={`/login${authSearch}`}>{t("confirm_email_begin.login")}</StyledLink>
                </p>
            </div>
        </div>
    );
};

export default ConfirmEmailScreen;
