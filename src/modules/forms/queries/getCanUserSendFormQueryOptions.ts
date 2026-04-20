import { queryOptions, UseQueryOptions } from "@tanstack/react-query";
import { url } from "../../../api";
import getAuthHeaders from "../../auth/helpers/getAuthHeaders";
import handleApiError from "../../shared/helpers/handleApiError";
import { CanUserSendFormOptions, CanUserSendFormResponse } from "../types";

export const getCanUserSendFormQueryOptions = (
    options: CanUserSendFormOptions,
    additionals?: Omit<UseQueryOptions<CanUserSendFormResponse>, "queryFn" | "queryKey">
) =>
    queryOptions<CanUserSendFormResponse>({
        queryKey: ["can-user-send-form", options],
        queryFn: async () => {
            try {
                const headers = getAuthHeaders();
                const response = await fetch(url.form.canUserSendForm(options), {
                    method: "GET",
                    headers,
                });

                const data = await response.json();

                if (!response.ok) {
                    throw handleApiError(data);
                }

                return data;
            } catch (error) {
                console.error("Error fetching form submission status:", error);
                throw error;
            }
        },
        ...additionals,
    });
