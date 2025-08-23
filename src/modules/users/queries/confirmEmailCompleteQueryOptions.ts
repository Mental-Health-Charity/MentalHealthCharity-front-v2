import { queryOptions } from "@tanstack/react-query";
import { url } from "../../../api";
import handleApiError from "../../shared/helpers/handleApiError";
import { ConfirmEmailCompletePayload, PublicProfile } from "../types";

export const confirmEmailCompleteQueryOptions = (options: ConfirmEmailCompletePayload) =>
    queryOptions<PublicProfile>({
        queryKey: ["confirmEmailComplete"],
        queryFn: async () => {
            try {
                const response = await fetch(url.users.confirmEmailComplete, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(options),
                });

                if (!response.ok) {
                    throw handleApiError(response);
                }

                return response.json();
            } catch (error) {
                throw handleApiError(error);
            }
        },
    });
