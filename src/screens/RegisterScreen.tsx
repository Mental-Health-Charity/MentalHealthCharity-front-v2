import { useNavigate } from "react-router-dom";
import login_background from "../assets/static/login_bg.svg";
import { useUser } from "../modules/auth/components/AuthProvider";
import RegisterForm from "../modules/auth/components/RegisterForm";
import { RegisterFormValues } from "../modules/auth/types";
import InternalLink from "../modules/shared/components/InternalLink";

const RegisterScreen = () => {
    const { register } = useUser();
    const navigate = useNavigate();

    const handleSubmit = (values: RegisterFormValues) => {
        register.mutate(values, {
            onSuccess: () => {
                navigate("/auth/confirm-email-begin");
            },
        });
    };

    return (
        <div className="flex">
            <div className="hidden max-w-[50%] overflow-hidden shadow-[3px_4px_4px_rgba(0,0,0,0.25)] max-md:max-w-0 md:block">
                <img className="h-screen" src={login_background} alt="Logo" />
            </div>

            <div className="bg-background flex min-h-screen w-full flex-col items-center justify-center px-5 pt-[120px] pb-5">
                <div className="max-w-[500px]">
                    <div className="mb-6 w-full text-center">
                        <h1 className="text-foreground mb-2 text-3xl font-bold">Utwórz nowe konto!</h1>
                        <p className="text-muted-foreground font-medium">
                            Zarejestruj się korzystając z poniższego formularza, cieszymy się, że do nas dołączasz!
                        </p>
                    </div>
                    <RegisterForm onSubmit={handleSubmit} />
                </div>
                <div className="mt-12 flex w-full items-center justify-center">
                    <p>
                        Masz już konto?{" "}
                        <InternalLink className="font-bold" to="/login">
                            Zaloguj się
                        </InternalLink>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default RegisterScreen;
