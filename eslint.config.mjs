// @ts-check

import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  // eslint.configs.recommended,
  {
    rules: {
      ...eslint.configs.recommended.rules,
      "@typescript-eslint/no-empty-object-type": "off",
    },
  },
  ...tseslint.configs.recommended
);
