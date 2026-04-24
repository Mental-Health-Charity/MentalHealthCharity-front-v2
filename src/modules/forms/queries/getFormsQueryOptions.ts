import { infiniteQueryOptions, queryOptions } from "@tanstack/react-query";
import { url } from "../../../api";
import getAuthHeaders from "../../auth/helpers/getAuthHeaders";
import handleApiError from "../../shared/helpers/handleApiError";
import { Pagination } from "../../shared/types";
import { FormResponse, MenteeForm, ReadAllFormOptions, VolunteerForm } from "../types";

type FormTypeById<T extends number> = T extends 2
    ? Pagination<FormResponse<VolunteerForm | MenteeForm>>
    : Pagination<FormResponse<VolunteerForm | MenteeForm>>;

type InfiniteFormsOptions<T extends number> = Omit<ReadAllFormOptions, "page"> & { form_type_id: T };

export const fetchForms = async (
    options: ReadAllFormOptions
): Promise<Pagination<FormResponse<VolunteerForm | MenteeForm>>> => {
    const headers = getAuthHeaders();

    try {
        const response = await fetch(url.form.read(options), {
            method: "GET",
            headers,
        });

        const data = await response.json();

        if (!response.ok) {
            await handleApiError(data);
            throw new Error("Failed to fetch forms");
        }

        return data;
    } catch (error) {
        console.error("Error fetching forms:", error);
        throw error;
    }
};

export const getFormsQueryOptions = <T extends number>(options: ReadAllFormOptions & { form_type_id: T }) =>
    queryOptions<FormTypeById<T>>({
        queryKey: ["forms", options],
        queryFn: () => fetchForms(options) as Promise<FormTypeById<T>>,
    });

export const getFormsInfiniteQueryOptions = <T extends number>(options: InfiniteFormsOptions<T>) =>
    infiniteQueryOptions({
        queryKey: ["forms-infinite", options] as const,
        initialPageParam: 1,
        queryFn: ({ pageParam }) =>
            fetchForms({
                ...options,
                page: Number(pageParam),
            }) as Promise<FormTypeById<T>>,
        getNextPageParam: (lastPage) => {
            if (lastPage.page >= lastPage.pages) {
                return undefined;
            }

            return lastPage.page + 1;
        },
    });
