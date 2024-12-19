import { url } from "../../../api";
import getAuthHeaders from "../../auth/helpers/getAuthHeaders";
import handleApiError from "../../shared/helpers/handleApiError";
import { ArticleCategory, UpdateArticleCategoryOptions } from "../types";

const updateArticleCategoryMutation = async ({
    id,
    name,
}: UpdateArticleCategoryOptions): Promise<ArticleCategory | undefined> => {
    const headers = getAuthHeaders();

    try {
        const res = await fetch(url.articleCategories.update({ id }), {
            method: "PUT",
            headers,
            body: JSON.stringify({ name }),
        });

        if (!res.ok) {
            throw handleApiError(res);
        }

        return await res.json();
    } catch (e) {
        console.error("While updating article category name:", e);
        throw e;
    }
};

export default updateArticleCategoryMutation;
