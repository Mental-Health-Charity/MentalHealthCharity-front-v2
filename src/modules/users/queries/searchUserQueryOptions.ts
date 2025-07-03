import { queryOptions, UseQueryOptions } from "@tanstack/react-query";
import { url } from "../../../api";
import getAuthHeaders from "../../auth/helpers/getAuthHeaders";
import { User } from "../../auth/types";
import Errors from "../../shared/constants";
import { Pagination } from "../../shared/types";
import { ReadSearchUsersOptions } from "../types";

export const searchUserQueryOptions = (
    options: ReadSearchUsersOptions,
    additional?: Omit<UseQueryOptions<Pagination<User>>, "queryKey" | "queryFn">
) =>
    queryOptions<Pagination<User>>({
        queryKey: ["search_user", options.query, options.role],
        queryFn: async () => {
            const headers = getAuthHeaders();

            const response = await fetch(url.users.searchUser(options), {
                headers,
            });

            if (!response.ok) {
                throw new Error(Errors.failed_to_fetch_public_profile);
            }

            return response.json();
        },
        ...additional,
    });
