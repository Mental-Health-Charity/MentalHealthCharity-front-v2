import { queryOptions } from "@tanstack/react-query";
import { url } from "../../../api";
import getAuthHeaders from "../../auth/helpers/getAuthHeaders";
import handleApiError from "../../shared/helpers/handleApiError";
import { Pagination } from "../../shared/types";
import { FormResponse, ReadAllFormOptions, VolunteerForm } from "../types";

type FormTypeById<T extends number> = T extends 2
    ? Pagination<FormResponse<VolunteerForm>>
    : Pagination<FormResponse<VolunteerForm>>;

export const getFormsQueryOptions = <T extends number>(options: ReadAllFormOptions & { form_type_id: T }) =>
    queryOptions<FormTypeById<T>>({
        queryKey: ["forms", options],
        queryFn: async () => {
            const headers = getAuthHeaders();

            try {
                const response = await fetch(url.form.read(options), {
                    method: "GET",
                    headers,
                });

                const data = await response.json();

                if (!response.ok) {
                    throw handleApiError(data);
                }

                return data;
            } catch (error) {
                console.error("Error fetching forms:", error);
                throw error;
            }
        },
    });
