import { url } from "../../../api";
import getAuthHeaders from "../../auth/helpers/getAuthHeaders";
import handleApiError from "../../shared/helpers/handleApiError";
import { Article, UpdateArticlePayload } from "../types";

const updateArticleMutation = async ({
    article_id,
    ...payload
}: UpdateArticlePayload): Promise<Article> => {
    const headers = getAuthHeaders();

    try {
        const res = await fetch(url.articles.update({ id: article_id }), {
            method: "PUT",
            headers,
            body: JSON.stringify(payload),
        });

        if (!res.ok) {
            throw handleApiError(res);
        }

        return await res.json();
    } catch (e) {
        console.error("While updating article banner:", e);
        throw e;
    }
};

export default updateArticleMutation;
