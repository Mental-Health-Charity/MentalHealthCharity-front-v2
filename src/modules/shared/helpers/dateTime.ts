export const APP_TIME_ZONE = "Europe/Warsaw";

const DATE_ONLY_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const OFFSET_PATTERN = /(?:Z|[+-]\d{2}:?\d{2})$/i;

export const parseApiDate = (value: string | Date): Date => {
    if (value instanceof Date) {
        return value;
    }

    const trimmedValue = value.trim();
    if (!trimmedValue) {
        return new Date(Number.NaN);
    }

    if (DATE_ONLY_PATTERN.test(trimmedValue) || OFFSET_PATTERN.test(trimmedValue)) {
        return new Date(trimmedValue);
    }

    return new Date(`${trimmedValue}Z`);
};

export const isApiDateInFuture = (value?: string | null, now: Date = new Date()) => {
    if (!value) {
        return false;
    }

    const parsedDate = parseApiDate(value);
    if (Number.isNaN(parsedDate.getTime())) {
        return false;
    }

    return parsedDate.getTime() > now.getTime();
};
