import { url } from "../../../api";
import getAuthHeaders from "../../auth/helpers/getAuthHeaders";
import handleApiError from "../../shared/helpers/handleApiError";
import { Article, CreateArticlePayload } from "../types";

const createArticleMutation = async (
    payload: CreateArticlePayload
): Promise<Article> => {
    const headers = getAuthHeaders();

    console.log("payload", payload);

    try {
        const res = await fetch(url.articles.create, {
            method: "POST",
            headers,
            body: JSON.stringify(payload),
        });

        if (!res.ok) {
            throw handleApiError(res);
        }

        return await res.json();
    } catch (e) {
        console.error("While creating article:", e);
        throw e;
    }
};

export default createArticleMutation;
