module.exports = {
    parser: '@typescript-eslint/parser',
    parserOptions: {
        sourceType: 'module'
    },
    plugins: ['@typescript-eslint/eslint-plugin'],
    extends: [
        'standard-with-typescript',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended'
    ],
    root: true,
    env: {
        node: true,
        jest: true
    },
    rules: {
        indent: ['error', 4],
        'linebreak-style': ['error', 'unix'],
        'eol-last': ['error', 'always']
    }
}
