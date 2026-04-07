import type { Route } from "./+types/home";
import { Welcome } from "../welcome/welcome";
import { authMiddleware } from "~/middleware/auth";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Router!" },
  ];
}
export const middleware = [authMiddleware];


export default function Home() {
  return <Welcome />;
}


export class AuthorizedError extends Error {
  statusCode: number = 401;
  constructor(message: string) {
    super(message);
  }
}
