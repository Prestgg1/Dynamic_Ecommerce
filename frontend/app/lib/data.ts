import type { components } from "./types";

export type Product = components["schemas"]["Product"];
export type Category = components["schemas"]["Category"];

export const categories: { id: string | "all"; labelKey: string }[] = [
  { id: "all", labelKey: "cat_all" },
  { id: "tools", labelKey: "cat_tools" },
  { id: "hardware", labelKey: "cat_hardware" },
  { id: "pipes", labelKey: "cat_pipes" },
  { id: "fasteners", labelKey: "cat_fasteners" },
  { id: "electrical", labelKey: "cat_electrical" },
  { id: "welding", labelKey: "cat_welding" },
  { id: "safety", labelKey: "cat_safety" },
];
