import { Heart, ShieldCheck } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useUser } from "../modules/auth/components/AuthProvider";
import {
    buildForwardedAuthSearch,
    CHAT_SUPPORT_INTENT,
    getAuthRedirectContext,
} from "../modules/auth/helpers/authRedirect";
import RegisterForm from "../modules/auth/components/RegisterForm";
import { RegisterFormValues } from "../modules/auth/types";
import InternalLink from "../modules/shared/components/InternalLink";

const RegisterScreen = () => {
    const { register } = useUser();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [searchParams] = useSearchParams();
    const authRedirect = getAuthRedirectContext(searchParams);
    const authSearch = buildForwardedAuthSearch(searchParams);
    const isChatSupportIntent = authRedirect.intent === CHAT_SUPPORT_INTENT;
    const subtitle = t(isChatSupportIntent ? "auth.register_chat_support.subtitle" : "auth.register.subtitle");

    const handleSubmit = (values: RegisterFormValues) => {
        register.mutate(
            {
                ...values,
                ...(authRedirect.intent ? { intent: authRedirect.intent } : {}),
                ...(authRedirect.next ? { next: authRedirect.next } : {}),
            },
            {
                onSuccess: () => {
                    navigate(`/auth/confirm-email-begin${authSearch}`);
                },
            }
        );
    };

    return (
        <div className="flex min-h-screen">
            {/* Left branded panel */}
            <div className="bg-primary-brand relative hidden w-1/2 flex-col items-center justify-center px-12 md:flex">
                <div className="relative z-10 max-w-[400px] text-center">
                    <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm">
                        <Heart className="size-8 text-white" />
                    </div>
                    <h2 className="text-3xl font-bold text-white">Peryskop</h2>
                    <p className="mt-3 text-lg text-white/80">{t("homepage.title")}</p>
                    <div className="mx-auto mt-8 max-w-[320px] rounded-xl bg-white/10 p-5 backdrop-blur-sm">
                        <p className="text-sm leading-relaxed text-white/90 italic">
                            &quot;{t("homepage.trust_mission.description")}&quot;
                        </p>
                    </div>
                </div>
            </div>

            {/* Right form panel */}
            <main className="bg-background flex w-full flex-col items-center justify-center px-5 py-12 md:w-1/2">
                <div className="bg-card w-full max-w-[440px] rounded-2xl border p-8 shadow-lg">
                    <div className="mb-6 text-center">
                        <h1 className="text-foreground text-2xl font-bold">
                            {t(isChatSupportIntent ? "auth.register_chat_support.title" : "auth.register.title")}
                        </h1>
                        {subtitle && <p className="text-muted-foreground mt-1 text-sm">{subtitle}</p>}
                        {isChatSupportIntent && (
                            <div className="border-primary-brand/15 bg-primary-brand/5 mt-4 flex items-start gap-3 rounded-xl border px-4 py-3 text-left">
                                <div className="bg-primary-brand/10 mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full">
                                    <ShieldCheck className="text-primary-brand size-4" />
                                </div>
                                <p className="text-primary-brand text-sm leading-relaxed">
                                    {t("auth.register_chat_support.notice")}
                                </p>
                            </div>
                        )}
                    </div>
                    <RegisterForm onSubmit={handleSubmit} />
                </div>
                <p className="text-muted-foreground mt-6 text-sm">
                    {t(isChatSupportIntent ? "auth.register_chat_support.has_account" : "auth.register.has_account")}{" "}
                    <InternalLink className="text-primary-brand font-semibold" to={`/login${authSearch}`}>
                        {t("auth.register.login_link")}
                    </InternalLink>
                </p>
            </main>
        </div>
    );
};

export default RegisterScreen;
