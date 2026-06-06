import createFetchClient from "openapi-fetch";
import createClient from "openapi-react-query";
import type { paths } from "./types";

export const BACKEND_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:4000";

const fetchClient = createFetchClient<paths>({
  baseUrl: BACKEND_URL,
  credentials: "include",
});

export const trpc = createClient(fetchClient);

export type User =
  paths["/auth/me"]["get"]["responses"]["200"]["content"]["application/json"];
export type Categories =
  paths["/categories"]["get"]["responses"]["200"]["content"]["application/json"];

export type Products =
  paths["/products"]["get"]["responses"]["200"]["content"]["application/json"];
