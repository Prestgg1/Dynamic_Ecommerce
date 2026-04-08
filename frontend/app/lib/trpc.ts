import createFetchClient from "openapi-fetch";
import createClient from "openapi-react-query";
import type { paths } from "./types";

const fetchClient = createFetchClient<paths>({
  baseUrl: import.meta.env.VITE_API_BASE_URL,
  credentials: "include",
});
// import.meta.env.VITE_API_BASE_URLd,
export const trpc = createClient(fetchClient);

export type User =
  paths["/auth/me"]["get"]["responses"]["200"]["content"]["application/json"];
export type Categories =
  paths["/categories"]["get"]["responses"]["200"]["content"]["application/json"];

export type Products =
  paths["/products"]["get"]["responses"]["200"]["content"]["application/json"];
