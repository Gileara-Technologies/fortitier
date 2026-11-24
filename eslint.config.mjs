import nextCoreWebVitals from "eslint-config-next/core-web-vitals";
import nextTypescript from "eslint-config-next/typescript";

const eslintConfig = [
  {
    ignores: [
      "node_modules/**",
      ".next/**",
      ".open-next/**",
      "out/**",
      "build/**",
      "coverage/**",
      "next-env.d.ts",
    ],
  },
  ...nextCoreWebVitals,
  ...nextTypescript,
  {
    // React Three Fiber scenes mutate Three.js objects imperatively inside
    // useFrame by design. The compiler-oriented immutability rules do not apply.
    files: ["src/components/three/**/*.{ts,tsx}", "src/components/experience/**/*.{ts,tsx}"],
    rules: {
      "react-hooks/immutability": "off",
      "react-hooks/use-memo": "off",
      "react-hooks/purity": "off",
      "react-hooks/refs": "off",
      "react/no-unknown-property": "off",
    },
  },
];

export default eslintConfig;
