import js from '@eslint/js'
import importPlugin from 'eslint-plugin-import'
import nodePlugin from 'eslint-plugin-node'
import prettierPlugin from 'eslint-plugin-prettier'
import promisePlugin from 'eslint-plugin-promise'
import securityPlugin from 'eslint-plugin-security'
import { defineConfig } from 'eslint/config'
import globals from 'globals'

export default defineConfig([
    importPlugin.flatConfigs.recommended,
    securityPlugin.configs.recommended,
    promisePlugin.configs['flat/recommended'],
    { ignores: ['dist', '**/*.config.{js,mjs,cjs}'] },
    {
        files: ['**/*.{js,mjs,cjs}'],
        plugins: { js, prettier: prettierPlugin, node: nodePlugin },
        extends: ['js/recommended'],
    },
    { files: ['**/*.js'], languageOptions: { sourceType: 'module' } },
    { files: ['**/*.{js,mjs,cjs}'], languageOptions: { globals: globals.node } },
    {
        rules: {
            curly: ['error', 'all'],
            eqeqeq: ['error', 'always'],
            'no-console': 'off',
            'no-var': 'error',
            'no-undef': 'error',
            'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
            'prefer-const': 'error',
            'prettier/prettier': 'error',
            'prefer-arrow-callback': 'warn',
            'require-await': 'warn',
            'import/no-dynamic-require': 'warn',
            'import/order': [
                'error',
                {
                    groups: ['external', 'builtin', 'sibling', 'internal'],
                    pathGroups: [
                        {
                            pattern: '#Models/*',
                            group: 'internal',
                        },
                        {
                            pattern: '#Routes/*',
                            group: 'internal',
                            position: 'after',
                        },
                        {
                            pattern: '#Middlewares/*',
                            group: 'internal',
                            position: 'after',
                        },
                        {
                            pattern: '#Validations/*',
                            group: 'internal',
                            position: 'after',
                        },
                        {
                            pattern: '#Utils/*',
                            group: 'internal',
                            position: 'after',
                        },
                        {
                            pattern: '#Config/*',
                            group: 'internal',
                            position: 'after',
                        },
                        {
                            pattern: '**constants**',
                            group: 'internal',
                            position: 'after',
                        },
                    ],
                    'newlines-between': 'always',
                    alphabetize: {
                        order: 'asc',
                        caseInsensitive: true,
                    },
                },
            ],
            'import/newline-after-import': ['warn', { count: 1 }],
            'import/no-unresolved': 'off',
        },
    },
    {
        settings: {
            'import/resolver': {
                node: {
                    extensions: 'js',
                    moduleDirectory: ['node_modules', 'src/'],
                },
                alias: {
                    map: [
                        ['#', 'src'],
                        ['#Config', 'src/config'],
                        ['#Controllers', 'src/controllers'],
                        ['#Middlewares', 'src/middlewares'],
                        ['#Models', 'src/models'],
                        ['#Routes', 'src/routes'],
                        ['#Utils', 'src/utils'],
                        ['#Validations', 'src/validations'],
                    ],
                    extensions: ['.js', '.jsx'],
                },
            },
        },
    },
])
