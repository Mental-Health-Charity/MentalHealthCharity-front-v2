import Logo from "@/assets/static/logo_small.webp";
import { Facebook, Linkedin, Mail } from "lucide-react";

interface TechnicalBreakScreenProps {
    description?: string;
    endsAtFormatted?: string | null;
}

const SOCIAL_LINKS = [
    {
        label: "Facebook",
        href: "https://www.facebook.com/groups/1340769720143310",
        icon: Facebook,
    },
    {
        label: "LinkedIn",
        href: "https://www.linkedin.com/company/fundacja-peryskop",
        icon: Linkedin,
    },
];

const TechnicalBreakScreen = ({ description, endsAtFormatted }: TechnicalBreakScreenProps) => {
    return (
        <main className="text-text-body relative isolate flex min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top,#e7f7f5_0%,#f6f9f9_45%,#ffffff_100%)] px-5 py-10 sm:px-8 sm:py-14">
            <div className="bg-primary-brand/20 absolute -top-40 -left-24 h-80 w-80 rounded-full blur-3xl motion-safe:animate-pulse" />
            <div className="bg-accent-brand/25 absolute right-[-10%] bottom-[-15%] h-96 w-96 rounded-full blur-3xl motion-safe:animate-pulse" />
            <div className="absolute inset-x-0 top-0 h-48 bg-[linear-gradient(120deg,rgba(13,166,158,0.12),rgba(255,193,92,0.08)_55%,transparent)]" />

            <section className="relative z-10 mx-auto flex w-full max-w-3xl flex-col items-center justify-center text-center">
                <img src={Logo} alt="Logo Fundacji Peryskop" className="mb-4 w-20 sm:mb-5 sm:w-24" />

                <p className="text-text-light text-xs font-semibold tracking-[0.2em] uppercase sm:text-sm">
                    Fundacja Peryskop
                </p>
                <h1 className="mt-3 text-4xl leading-tight font-extrabold sm:text-5xl">Przerwa techniczna</h1>

                <p className="mt-6 max-w-2xl text-base leading-relaxed sm:text-lg">
                    Pracujemy nad aktualizacją aplikacji. Przepraszamy za utrudnienia i dziękujemy za cierpliwość.
                </p>

                {description ? (
                    <p className="bg-primary-brand-50 border-primary-brand/25 mt-5 max-w-2xl rounded-2xl border px-4 py-3 text-sm leading-relaxed sm:text-base">
                        {description}
                    </p>
                ) : null}

                {endsAtFormatted ? (
                    <p className="text-text-light mt-5 text-sm sm:text-base">
                        Planowane zakończenie prac:{" "}
                        <span className="text-text-body font-semibold">{endsAtFormatted}</span>
                    </p>
                ) : null}

                <div className="border-border-brand/70 mt-10 w-full max-w-xl border-t pt-6">
                    <p className="mb-3 text-sm font-semibold">Kontakt</p>
                    <a
                        href="mailto:kontakt@fundacjaperyskop.org"
                        className="group text-primary-brand-dark hover:text-primary-brand inline-flex items-center gap-2 text-sm font-medium transition-colors sm:text-base"
                    >
                        <Mail className="size-4" />
                        kontakt@fundacjaperyskop.org
                    </a>

                    <div className="mt-4 flex flex-wrap justify-center gap-3">
                        {SOCIAL_LINKS.map((social) => {
                            const Icon = social.icon;

                            return (
                                <a
                                    key={social.label}
                                    href={social.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={social.label}
                                    className="border-border-brand text-text-body hover:border-primary-brand/60 hover:text-primary-brand-dark inline-flex items-center gap-2 rounded-full border bg-white/80 px-4 py-2 text-sm font-medium transition-all hover:-translate-y-0.5"
                                >
                                    <Icon className="size-4" />
                                    {social.label}
                                </a>
                            );
                        })}
                    </div>
                </div>
            </section>
        </main>
    );
};

export default TechnicalBreakScreen;
