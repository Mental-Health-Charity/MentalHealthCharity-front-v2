import { url } from "../../../api";
import getAuthHeaders from "../../auth/helpers/getAuthHeaders";
import handleApiError from "../../shared/helpers/handleApiError";
import { Article, ChangeArticleStatusPayload } from "../types";

const changeStatusMutation = async ({ id, ...payload }: ChangeArticleStatusPayload): Promise<Article | undefined> => {
    const headers = getAuthHeaders();

    try {
        const res = await fetch(url.articles.changeStatus({ id }), {
            method: "PUT",
            headers,
            body: JSON.stringify(payload),
        });

        if (!res.ok) {
            throw handleApiError(res);
        }

        return await res.json();
    } catch (e) {
        console.error("While changing article status:", e);
        throw e;
    }
};

export default changeStatusMutation;
