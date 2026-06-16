import { infiniteQueryOptions, queryOptions } from "@tanstack/react-query";
import { url } from "../../../api";
import getAuthHeaders from "../../auth/helpers/getAuthHeaders";
import handleApiError from "../../shared/helpers/handleApiError";
import { Pagination } from "../../shared/types";
import { formTypes, FormOptions, FormResponse, MenteeForm, ReadAllFormOptions, VolunteerForm } from "../types";

type FormTypeByCode<T extends formTypes> = T extends formTypes.MENTEE
    ? Pagination<FormResponse<MenteeForm>>
    : Pagination<FormResponse<VolunteerForm>>;

type InfiniteFormsOptions<T extends formTypes> = Omit<ReadAllFormOptions, "page"> & { form_type: T };

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

export const fetchFormById = async ({ id }: FormOptions): Promise<FormResponse<VolunteerForm | MenteeForm>> => {
    const response = await fetch(url.form.readById({ id }), {
        method: "GET",
        headers: getAuthHeaders(),
    });

    const data = await response.json();

    if (!response.ok) {
        await handleApiError(data);
        throw new Error("Failed to fetch form");
    }

    return data;
};

export const getFormByIdQueryOptions = (options: FormOptions) =>
    queryOptions<FormResponse<VolunteerForm | MenteeForm>>({
        queryKey: ["forms", "detail", options.id],
        queryFn: () => fetchFormById(options),
    });

export const getFormsQueryOptions = <T extends formTypes>(options: ReadAllFormOptions & { form_type: T }) =>
    queryOptions<FormTypeByCode<T>>({
        queryKey: ["forms", options],
        queryFn: () => fetchForms(options) as Promise<FormTypeByCode<T>>,
    });

export const getFormsInfiniteQueryOptions = <T extends formTypes>(options: InfiniteFormsOptions<T>) =>
    infiniteQueryOptions({
        queryKey: ["forms-infinite", options] as const,
        initialPageParam: 1,
        queryFn: ({ pageParam }) =>
            fetchForms({
                ...options,
                page: Number(pageParam),
            }) as Promise<FormTypeByCode<T>>,
        getNextPageParam: (lastPage) => {
            if (lastPage.page >= lastPage.pages) {
                return undefined;
            }

            return lastPage.page + 1;
        },
    });
