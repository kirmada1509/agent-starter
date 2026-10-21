const configuration = {
  "*.{js,jsx,ts,tsx,mjs,cjs}": [
    "prettier --write",
    "eslint --fix --no-warn-ignored",
  ],
  "*.{json,md,yaml,yml,css}": "prettier --write",
};

export default configuration;
