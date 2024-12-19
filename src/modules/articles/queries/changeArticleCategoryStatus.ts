import { url } from "../../../api";
import getAuthHeaders from "../../auth/helpers/getAuthHeaders";
import handleApiError from "../../shared/helpers/handleApiError";
import { ArticleCategory, ArticleCategoryOptions } from "../types";

const updateArticleCategoryStatusMutation = async (
    options: ArticleCategoryOptions
): Promise<ArticleCategory | undefined> => {
    const headers = getAuthHeaders();

    try {
        const res = await fetch(url.articleCategories.changeStatus(options), {
            method: "PUT",
            headers,
        });

        if (!res.ok) {
            throw handleApiError(res);
        }

        return await res.json();
    } catch (e) {
        console.error("While updating article status:", e);
        throw e;
    }
};

export default updateArticleCategoryStatusMutation;
