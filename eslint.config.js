import eslint from "@eslint/js";
import configPrettier from "eslint-config-prettier";
import pluginVue from "eslint-plugin-vue";
import typescriptEslint from "typescript-eslint";

export default typescriptEslint.config(
  { ignores: ["*.d.ts", "**/dist"] },
  {
    extends: [
      eslint.configs.recommended,
      ...typescriptEslint.configs.recommended,
      ...pluginVue.configs["flat/recommended"],
    ],
    files: ["src/**/*.{ts,vue}"],
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: {
        parser: typescriptEslint.parser,
      },
    },
    rules: {
      "vue/multi-word-component-names": 0,
    },
  },
  configPrettier,
);
