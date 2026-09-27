import { browserHeaders } from "./scripts/http-policy.mjs";

/** @type {import('next').NextConfig} */
const config = {
  output: "export",
  poweredByHeader: false,
  reactStrictMode: true,
  // Development-only HMR. The built app is served with connect-src 'none'.
  ...(process.env.NODE_ENV === "development"
    ? { async headers() { return [{ source: "/:path*", headers: browserHeaders(true) }]; } }
    : {}),
};
export default config;
