import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import netlifyReactRouter from "@netlify/vite-plugin-react-router";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [
    tailwindcss(),
    reactRouter(),
    netlifyReactRouter(),
    tsconfigPaths(), // ← plugin kimi işlət
  ],
  server: {
    allowedHosts: ['tapz3h-ip-37-114-131-126.tunnelmole.net']
  }
});
