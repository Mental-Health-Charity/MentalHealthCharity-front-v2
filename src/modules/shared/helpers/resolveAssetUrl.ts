import { baseUrl } from "../../../api";

const ABSOLUTE_URL_PATTERN = /^(?:[a-z]+:)?\/\//i;

const resolveAssetUrl = (url?: string | null) => {
    if (!url) {
        return undefined;
    }

    if (ABSOLUTE_URL_PATTERN.test(url) || url.startsWith("data:") || url.startsWith("blob:")) {
        return url;
    }

    const normalizedPath = url.startsWith("/") ? url : `/${url}`;
    return `${baseUrl}${normalizedPath}`;
};

export default resolveAssetUrl;
