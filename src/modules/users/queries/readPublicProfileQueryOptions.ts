import { queryOptions, UseQueryOptions } from "@tanstack/react-query";
import { url } from "../../../api";
import { PublicProfile, PublicProfileOptions } from "../types";
import Errors from "../../shared/constants";

export const readPublicProfileQueryOptions = (
  options: PublicProfileOptions,
  additional: Omit<UseQueryOptions<PublicProfile>, "queryKey" | "queryFn">
) =>
  queryOptions<PublicProfile>({
    queryKey: ["publicProfile"],
    queryFn: async () => {
      const response = await fetch(url.publicProfiles.read(options));

      if (!response.ok) {
        throw new Error(Errors.failed_to_fetch_public_profile);
      }

      return response.json();
    },
    ...additional,
  });
