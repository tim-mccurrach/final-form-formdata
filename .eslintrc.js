module.exports = {
  env: {
    browser: true,
    es2020: true,
    node: true,
    jest: true,
  },
  extends: ["eslint:recommended", "eslint-config-prettier"],
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 11,
    sourceType: "module",
  },
  rules: { "no-console": "error" },
};
