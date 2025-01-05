/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
    extends: [
        'eslint:recommended',
        'plugin:vue/vue3-recommended',
        '@electron-toolkit',
        '@electron-toolkit/eslint-config-ts/eslint-recommended',
        '@vue/eslint-config-typescript/recommended',
        '@vue/eslint-config-prettier',
        'prettier',
    ],
    plugins: ['prettier'],
    rules: {
        'vue/require-default-prop': 'off',
        'vue/multi-word-component-names': 'off',
        indent: ['error', 4], // Ensure ESLint enforces 4-space indentation
        'vue/html-indent': ['error', 4], // 4-space indentation for Vue templates
        'prettier/prettier': ['error', { tabWidth: 4 }], // Align Prettier with 4-space indentation
    },
}
