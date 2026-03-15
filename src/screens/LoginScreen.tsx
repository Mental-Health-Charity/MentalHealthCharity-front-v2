import { useState } from "react";
import { useNavigate } from "react-router-dom";
import login_background from "../assets/static/login_bg.svg";
import { useUser } from "../modules/auth/components/AuthProvider";
import LoginForm from "../modules/auth/components/LoginForm";
import { LoginFormValues } from "../modules/auth/types";
import InternalLink from "../modules/shared/components/InternalLink";

const LoginScreen = () => {
    const { login } = useUser();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const handleSubmit = (values: LoginFormValues) => {
        setLoading(true);
        login.mutate(values, {
            onSuccess: () => {
                navigate("/");
                setLoading(false);
            },
            onError: () => {
                setLoading(false);
            },
        });
    };

    return (
        <div className="flex">
            <div className="hidden max-w-[50%] overflow-hidden shadow-[3px_4px_4px_rgba(0,0,0,0.25)] md:block">
                <img className="h-screen" src={login_background} alt="Logo" />
            </div>

            <div className="bg-background flex min-h-screen w-full flex-col items-center justify-center px-5 pt-[90px] pb-5">
                <div className="max-w-[500px]">
                    <div className="mb-6 w-full text-center">
                        <h1 className="text-foreground mb-2 text-3xl font-bold">Witaj ponownie!</h1>
                        <p className="text-muted-foreground font-medium">
                            Zaloguj się korzystając z poniższego formularza, cieszymy się, że wróciłeś!
                        </p>
                    </div>
                    <LoginForm disabled={loading} onSubmit={handleSubmit} />
                </div>
                <div className="mt-12 flex w-full items-center justify-center">
                    <p>
                        Nie masz konta?{" "}
                        <InternalLink className="font-bold" to="/auth/register">
                            Zarejestruj się
                        </InternalLink>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default LoginScreen;
