module.exports = {
    "extends": ["plugin:react/recommended", "plugin:react/jsx-runtime", "standard", "eslint-config-prettier"],
    "parser": "@typescript-eslint/parser",
    "plugins": ['@typescript-eslint'],
    "settings": {
        'import/resolver': {
            node: {
                extensions: ['.js', '.jsx', '.ts', '.tsx'],
                moduleDirectory: ['node_modules', './']
            }
        }
    },
    "overrides": [
        {
            files: ['*.ts', '*.tsx'],
            rules: {
                'no-undef': 'off',
            }
        }
    ],
    "rules": {
        "no-unused-vars": "off",
        "@typescript-eslint/no-unused-vars": [
            "error",
            { "argsIgnorePattern": "^_" }
        ]
    }
}