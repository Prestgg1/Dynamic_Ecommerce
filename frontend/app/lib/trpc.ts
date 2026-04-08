import createFetchClient from "openapi-fetch";
import createClient from "openapi-react-query";
import type { paths } from "./types";

const API_BASE_URL = "https://9bd8-62-212-236-132.ngrok-free.app";

const fetchClient = createFetchClient<paths>({
  baseUrl: API_BASE_URL,
  credentials: "include",
});

export const trpc = createClient(fetchClient);


export type User =
  paths["/auth/me"]["get"]["responses"]["200"]["content"]["application/json"];
export type Categories =
  paths["/categories"]["get"]["responses"]["200"]["content"]["application/json"];

export type Products = paths["/products"]["get"]["responses"]["200"]["content"]["application/json"];