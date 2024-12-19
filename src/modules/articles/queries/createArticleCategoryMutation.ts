import { url } from "../../../api";
import getAuthHeaders from "../../auth/helpers/getAuthHeaders";
import handleApiError from "../../shared/helpers/handleApiError";
import { ArticleCategory, CreateArticleCategoryPayload } from "../types";

const createArticleCategoryMutation = async (
    payload: CreateArticleCategoryPayload
): Promise<ArticleCategory | undefined> => {
    const headers = getAuthHeaders();

    try {
        const res = await fetch(url.articleCategories.create, {
            method: "POST",
            headers,
            body: JSON.stringify(payload),
        });

        if (!res.ok) {
            throw handleApiError(res);
        }

        return await res.json();
    } catch (e) {
        console.error("While creating article category:", e);
        throw e;
    }
};

export default createArticleCategoryMutation;
