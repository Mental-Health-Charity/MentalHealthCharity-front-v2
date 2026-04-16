import { Heart } from "lucide-react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useUser } from "../modules/auth/components/AuthProvider";
import { buildForwardedAuthSearch, getAuthRedirectTarget } from "../modules/auth/helpers/authRedirect";
import LoginForm from "../modules/auth/components/LoginForm";
import { LoginFormValues } from "../modules/auth/types";
import InternalLink from "../modules/shared/components/InternalLink";

const LoginScreen = () => {
    const { login } = useUser();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const { t } = useTranslation();
    const [searchParams] = useSearchParams();
    const authSearch = buildForwardedAuthSearch(searchParams);

    const handleSubmit = (values: LoginFormValues) => {
        setLoading(true);
        login.mutate(values, {
            onSuccess: () => {
                navigate(getAuthRedirectTarget(searchParams));
                setLoading(false);
            },
            onError: () => {
                setLoading(false);
            },
        });
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
                        <h1 className="text-foreground text-2xl font-bold">{t("auth.login.title")}</h1>
                        <p className="text-muted-foreground mt-1 text-sm">{t("auth.login.subtitle")}</p>
                    </div>
                    <LoginForm disabled={loading} onSubmit={handleSubmit} />
                </div>
                <p className="text-muted-foreground mt-6 text-sm">
                    {t("auth.login.no_account")}{" "}
                    <InternalLink className="text-primary-brand font-semibold" to={`/auth/register${authSearch}`}>
                        {t("auth.login.register_link")}
                    </InternalLink>
                </p>
            </main>
        </div>
    );
};

export default LoginScreen;
