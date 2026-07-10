import { Button } from "@/components/ui/button";
import {
    ArrowLeft,
    ExternalLink,
    Globe,
    HeartHandshake,
    IdCard,
    KeyRound,
    ScanEye,
    ShieldAlert,
    ShieldX,
} from "lucide-react";
import { Trans, useTranslation } from "react-i18next";
import { useNavigate, useSearchParams } from "react-router-dom";
import Container from "../modules/shared/components/Container";
import {
    assessUrlThreats,
    isDonationPlatformUrl,
    LEAVING_URL_PARAM,
    OFFICIAL_FUNDRAISER_URL,
    parseSafeHttpUrl,
    type UrlThreat,
} from "../modules/shared/helpers/externalLink";

const officialFundraiser = parseSafeHttpUrl(OFFICIAL_FUNDRAISER_URL);

// Maps each detected threat to a plain-language explanation shown to the user.
const THREAT_LABEL_KEYS: Record<UrlThreat, string> = {
    insecure: "chat.leaving.reason_insecure",
    "ip-host": "chat.leaving.reason_ip",
    punycode: "chat.leaving.reason_punycode",
    userinfo: "chat.leaving.reason_userinfo",
    impersonation: "chat.leaving.reason_impersonation",
    "suspicious-tld": "chat.leaving.reason_suspicious_tld",
};

const LeavingScreen = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [params] = useSearchParams();

    const rawUrl = params.get(LEAVING_URL_PARAM) ?? "";
    const url = parseSafeHttpUrl(rawUrl);

    const goBack = () => {
        if (window.history.length > 1) navigate(-1);
        else navigate("/chat");
    };

    const proceed = () => {
        // Never follow an unparseable or dangerous link, even if this is somehow
        // reached (the dangerous branch below has no "continue" button at all).
        if (!url || assessUrlThreats(url).length > 0) return;
        // Open the external destination in a new tab, fully isolated from the app,
        // then return the user to where they came from (the chat).
        window.open(url.href, "_blank", "noopener,noreferrer");
        goBack();
    };

    const openOfficialFundraiser = () => {
        window.open(OFFICIAL_FUNDRAISER_URL, "_blank", "noopener,noreferrer");
        goBack();
    };

    // Malformed or unsafe link — never offer a way to follow it.
    if (!url) {
        return (
            <Container className="flex flex-col items-center py-12 md:py-20">
                <div className="bg-card border-border/60 w-full max-w-lg rounded-3xl border p-8 text-center shadow-xl sm:p-10">
                    <div className="bg-danger-brand/10 mx-auto flex size-16 items-center justify-center rounded-2xl">
                        <ShieldAlert className="text-danger-brand size-8" />
                    </div>
                    <h1 className="mt-5 text-2xl font-semibold">{t("chat.leaving.invalid_title")}</h1>
                    <p className="text-muted-foreground mt-2 leading-relaxed">
                        {t("chat.leaving.invalid_description")}
                    </p>
                    <Button className="mt-7 w-full sm:w-auto" size="lg" onClick={goBack}>
                        <ArrowLeft className="size-4" />
                        {t("chat.leaving.back")}
                    </Button>
                </div>
            </Container>
        );
    }

    // Dangerous links (unencrypted http, spoofed or suspicious domains, hidden
    // credentials, ...) are blocked outright — there is no "continue anyway".
    const threats = assessUrlThreats(url);
    if (threats.length > 0) {
        return (
            <Container className="flex flex-col items-center py-12 md:py-20">
                <div className="bg-card border-border/60 w-full max-w-lg overflow-hidden rounded-3xl border shadow-xl">
                    {/* Danger header */}
                    <div className="bg-danger-brand/10 px-6 pt-10 pb-8 text-center sm:px-8">
                        <div className="bg-danger-brand shadow-danger-brand/30 mx-auto flex size-16 items-center justify-center rounded-2xl text-white shadow-lg">
                            <ShieldX className="size-8" strokeWidth={2.25} />
                        </div>
                        <span className="bg-danger-brand/15 text-danger-brand mt-5 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold tracking-wide uppercase">
                            <ShieldAlert className="size-3.5" />
                            {t("chat.leaving.blocked_badge")}
                        </span>
                        <h1 className="mt-3 text-2xl font-semibold text-balance">{t("chat.leaving.blocked_title")}</h1>
                        <p className="text-muted-foreground mx-auto mt-2 leading-relaxed">
                            {t("chat.leaving.blocked_description")}
                        </p>
                    </div>

                    <div className="space-y-6 px-6 pt-3 pb-8 sm:px-10">
                        {/* Blocked destination */}
                        <div>
                            <span className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                                {t("chat.leaving.destination_blocked")}
                            </span>
                            <div className="bg-danger-brand/5 border-danger-brand/30 mt-2 flex items-center gap-3 rounded-2xl border p-3.5">
                                <div className="bg-card border-danger-brand/30 flex size-11 shrink-0 items-center justify-center rounded-xl border">
                                    <Globe className="text-danger-brand size-5" />
                                </div>
                                <div className="min-w-0 flex-1 text-left">
                                    <p className="truncate text-base font-semibold" title={url.hostname}>
                                        {url.hostname}
                                    </p>
                                    <p className="text-muted-foreground truncate text-xs" title={url.href}>
                                        {url.href}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Why it was blocked */}
                        <div>
                            <span className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                                {t("chat.leaving.blocked_reasons_heading")}
                            </span>
                            <ul className="mt-3 space-y-2.5">
                                {threats.map((threat) => (
                                    <li key={threat} className="flex items-start gap-3">
                                        <span className="bg-danger-brand/10 text-danger-brand mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg">
                                            <ShieldX className="size-4" />
                                        </span>
                                        <span className="text-foreground/90 text-sm leading-relaxed">
                                            {t(THREAT_LABEL_KEYS[threat])}
                                        </span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Only a safe way back — never a way forward. */}
                        <Button className="w-full" size="lg" onClick={goBack}>
                            <ArrowLeft className="size-4" />
                            {t("chat.leaving.back")}
                        </Button>
                    </div>
                </div>
            </Container>
        );
    }

    // Links to donation platforms other than our own fundraiser: warn that it is
    // an unofficial collection and steer the user to the official one.
    if (isDonationPlatformUrl(url)) {
        return (
            <Container className="flex flex-col items-center py-12 md:py-20">
                <div className="bg-card border-border/60 w-full max-w-lg overflow-hidden rounded-3xl border shadow-xl">
                    {/* Caution header */}
                    <div className="from-warning-brand/15 to-accent-brand/10 bg-gradient-to-br px-6 pt-10 pb-8 text-center sm:px-8">
                        <div className="from-warning-brand to-accent-brand shadow-warning-brand/30 mx-auto flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-lg">
                            <HeartHandshake className="size-8" strokeWidth={2.25} />
                        </div>
                        <span className="bg-warning-brand/15 text-warning-brand mt-5 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold tracking-wide uppercase">
                            <ShieldAlert className="size-3.5" />
                            {t("chat.leaving.donation_badge")}
                        </span>
                        <h1 className="mt-3 text-2xl font-semibold text-balance">{t("chat.leaving.donation_title")}</h1>
                        <p className="text-muted-foreground mx-auto mt-2 leading-relaxed">
                            {t("chat.leaving.donation_description")}
                        </p>
                    </div>

                    <div className="space-y-6 px-6 pt-3 pb-8 sm:px-10">
                        {/* The link that was posted */}
                        <div>
                            <span className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                                {t("chat.leaving.donation_detected")}
                            </span>
                            <div className="bg-muted/60 border-border/50 mt-2 flex items-center gap-3 rounded-2xl border p-3.5">
                                <div className="bg-card border-border/60 flex size-11 shrink-0 items-center justify-center rounded-xl border">
                                    <Globe className="text-muted-foreground size-5" />
                                </div>
                                <div className="min-w-0 flex-1 text-left">
                                    <p className="truncate text-base font-semibold" title={url.hostname}>
                                        {url.hostname}
                                    </p>
                                    <p className="text-muted-foreground truncate text-xs" title={url.href}>
                                        {url.href}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* The official fundraiser to donate through instead */}
                        {officialFundraiser && (
                            <div>
                                <span className="text-primary-brand text-xs font-semibold tracking-wide uppercase">
                                    {t("chat.leaving.donation_official_heading")}
                                </span>
                                <div className="border-primary-brand/40 bg-primary-brand-light mt-2 flex items-center gap-3 rounded-2xl border p-3.5">
                                    <div className="bg-primary-brand flex size-11 shrink-0 items-center justify-center rounded-xl text-white">
                                        <HeartHandshake className="size-5" />
                                    </div>
                                    <div className="min-w-0 flex-1 text-left">
                                        <p className="text-primary-brand-dark truncate text-base font-semibold">
                                            {officialFundraiser.hostname}
                                            {officialFundraiser.pathname}
                                        </p>
                                        <p className="text-primary-brand-dark/70 truncate text-xs">
                                            {t("chat.leaving.donation_official_heading")}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Actions: official fundraiser first, then a muted way out. */}
                        <div className="space-y-2.5 pt-1">
                            <Button className="w-full" size="lg" onClick={openOfficialFundraiser}>
                                <HeartHandshake className="size-4" />
                                {t("chat.leaving.donation_official_cta")}
                            </Button>
                            <Button variant="outline" className="w-full" size="lg" onClick={goBack}>
                                <ArrowLeft className="size-4" />
                                {t("chat.leaving.back")}
                            </Button>
                            <button
                                onClick={proceed}
                                className="text-muted-foreground hover:text-foreground mx-auto block cursor-pointer text-xs underline underline-offset-2"
                            >
                                {t("chat.leaving.donation_proceed")}
                            </button>
                        </div>
                    </div>
                </div>
            </Container>
        );
    }

    const tips = [
        { icon: KeyRound, text: t("chat.leaving.tip_password") },
        { icon: IdCard, text: t("chat.leaving.tip_data") },
        { icon: ScanEye, text: t("chat.leaving.tip_verify") },
        { icon: ShieldX, text: t("chat.leaving.tip_impersonation") },
    ];

    return (
        <Container className="flex flex-col items-center py-12 md:py-20">
            <div className="bg-card border-border/60 w-full max-w-lg overflow-hidden rounded-3xl border shadow-xl">
                {/* Accent header with the caution icon */}
                <div className="from-warning-brand/15 to-accent-brand/10 relative bg-gradient-to-br px-6 pt-10 pb-8 text-center sm:px-8">
                    <div className="from-warning-brand to-accent-brand shadow-warning-brand/30 mx-auto flex size-16 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-lg">
                        <ExternalLink className="size-8" strokeWidth={2.25} />
                    </div>
                    <span className="bg-warning-brand/15 text-warning-brand mt-5 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold tracking-wide uppercase">
                        <ShieldAlert className="size-3.5" />
                        {t("chat.leaving.badge")}
                    </span>
                    <h1 className="mt-3 text-2xl font-semibold text-balance">{t("chat.leaving.title")}</h1>
                    <p className="text-muted-foreground mx-auto mt-2 leading-relaxed">
                        <Trans
                            i18nKey="chat.leaving.subtitle"
                            values={{ host: url.hostname }}
                            components={{
                                strong: <strong className="text-foreground font-semibold [overflow-wrap:anywhere]" />,
                            }}
                        />
                    </p>
                </div>

                <div className="space-y-6 px-8 pt-3 pb-8 sm:px-10">
                    {/* Destination — hostname emphasised so the user can spot spoofing. */}
                    <div>
                        <span className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                            {t("chat.leaving.destination")}
                        </span>
                        <div className="bg-muted/60 border-border/50 mt-2 flex items-center gap-3 rounded-2xl border p-3.5">
                            <div className="bg-card border-border/60 flex size-11 shrink-0 items-center justify-center rounded-xl border">
                                <Globe className="text-primary-brand size-5" />
                            </div>
                            <div className="min-w-0 flex-1 text-left">
                                <p className="truncate text-base font-semibold" title={url.hostname}>
                                    {url.hostname}
                                </p>
                                <p className="text-muted-foreground truncate text-xs" title={url.href}>
                                    {url.href}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Safety tips */}
                    <div>
                        <span className="text-muted-foreground text-xs font-medium tracking-wide uppercase">
                            {t("chat.leaving.tips_heading")}
                        </span>
                        <ul className="mt-3 space-y-2.5">
                            {tips.map(({ icon: Icon, text }, i) => (
                                <li key={i} className="flex items-start gap-3">
                                    <span className="bg-warning-brand/10 text-warning-brand mt-0.5 flex size-7 shrink-0 items-center justify-center rounded-lg">
                                        <Icon className="size-4" />
                                    </span>
                                    <span className="text-foreground/90 text-sm leading-relaxed">{text}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col gap-2.5 pt-1 sm:flex-row-reverse">
                        <Button className="w-full sm:flex-1" size="lg" onClick={goBack}>
                            <ArrowLeft className="size-4" />
                            {t("chat.leaving.back")}
                        </Button>
                        <Button variant="outline" className="w-full sm:flex-1" size="lg" onClick={proceed}>
                            <ExternalLink className="size-4" />
                            {t("chat.leaving.proceed")}
                        </Button>
                    </div>
                </div>
            </div>
        </Container>
    );
};

export default LeavingScreen;
