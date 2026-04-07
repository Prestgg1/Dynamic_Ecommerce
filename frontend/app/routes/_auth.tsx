import { Outlet } from "react-router";
import { authMiddleware } from "~/middleware/auth";

export const middleware = [authMiddleware];

export default function AuthLayout() {
  return <Outlet />;
}