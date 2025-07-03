import { url } from "../../../api";
import getAuthHeaders from "../../auth/helpers/getAuthHeaders";
import handleApiError from "../../shared/helpers/handleApiError";
import { Article, UpdateArticleBannerOptions } from "../types";

const updateArticleBannerMutation = async ({ article_id, banner }: UpdateArticleBannerOptions): Promise<Article> => {
    const headers = getAuthHeaders();

    const formData = new FormData();
    formData.append("banner", banner); // banner może być Base64 lub plikiem

    try {
        const res = await fetch(url.articles.updateBanner({ id: article_id }), {
            method: "PUT",
            headers: {
                ...headers,
                "Content-Type": "multipart/form-data",
            },
            body: formData,
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

export default updateArticleBannerMutation;
