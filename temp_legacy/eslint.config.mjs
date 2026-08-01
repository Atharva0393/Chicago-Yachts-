import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // Part of eslint-plugin-react-hooks v7's React-Compiler-readiness
      // ruleset. It flags the standard "fetch on mount, track a loading
      // flag" pattern used throughout the owner/admin/search data-fetching
      // components — not an actual bug here, so warn instead of failing CI.
      "react-hooks/set-state-in-effect": "warn",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    // api/ is a separate NestJS project with its own eslint config — don't
    // lint its source or compiled dist/ output from the root config.
    "api/**",
  ]),
]);

export default eslintConfig;
