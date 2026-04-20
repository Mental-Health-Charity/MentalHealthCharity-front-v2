export const CHAT_SUPPORT_INTENT = "chat-support";

const NEXT_PARAM = "next";
const INTENT_PARAM = "intent";
const ALLOWED_INTENTS = new Set([CHAT_SUPPORT_INTENT]);

interface AuthRedirectContext {
    intent: string | null;
    next: string | null;
}

const sanitizeAuthIntent = (intent: string | null) => {
    if (!intent || !ALLOWED_INTENTS.has(intent)) {
        return null;
    }

    return intent;
};

const sanitizeAuthNext = (next: string | null) => {
    if (!next || !next.startsWith("/") || next.startsWith("//") || next.includes("://")) {
        return null;
    }

    return next;
};

export const getAuthRedirectContext = (searchParams: URLSearchParams): AuthRedirectContext => ({
    intent: sanitizeAuthIntent(searchParams.get(INTENT_PARAM)),
    next: sanitizeAuthNext(searchParams.get(NEXT_PARAM)),
});

export const buildAuthSearch = ({ intent, next }: Partial<AuthRedirectContext>) => {
    const params = new URLSearchParams();

    if (intent) {
        params.set(INTENT_PARAM, intent);
    }

    if (next) {
        params.set(NEXT_PARAM, next);
    }

    const query = params.toString();

    return query ? `?${query}` : "";
};

export const buildAuthUrl = (pathname: string, context: Partial<AuthRedirectContext>) => {
    return `${pathname}${buildAuthSearch(context)}`;
};

export const buildChatSupportRegisterUrl = (next = "/form/mentee") => {
    return buildAuthUrl("/auth/register", {
        intent: CHAT_SUPPORT_INTENT,
        next: sanitizeAuthNext(next) ?? "/form/mentee",
    });
};

export const buildForwardedAuthSearch = (searchParams: URLSearchParams) => {
    return buildAuthSearch(getAuthRedirectContext(searchParams));
};

export const getAuthRedirectTarget = (searchParams: URLSearchParams, fallback = "/") => {
    return getAuthRedirectContext(searchParams).next ?? fallback;
};
