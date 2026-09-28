import nextCoreVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";
const config = [
  ...nextCoreVitals,
  ...nextTypescript,
  { ignores: [".next/**", "out/**", "node_modules/**", "next-env.d.ts"] },
  {
    settings: { react: { version: "19.3" } },
    rules: { "react-hooks/set-state-in-effect": "off" },
  },
];
export default config;
