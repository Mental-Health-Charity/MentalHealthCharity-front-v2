import { baseUrl } from "../../../api";

const resolveAssetUrl = (value?: string | null) => {
    if (!value) return undefined;
    if (value.startsWith("http://") || value.startsWith("https://") || value.startsWith("data:")) {
        return value;
    }

    if (value.startsWith("/")) {
        return `${baseUrl}${value}`;
    }

    return `${baseUrl}/${value}`;
};

export default resolveAssetUrl;
