module.exports = {
    root: true, // Określa, że to główny plik konfiguracyjny ESLint
    env: {
        browser: true, // Środowisko przeglądarki
        es2021: true, // Wsparcie dla ES2021+
        node: true, // Środowisko Node.js
    },
    parser: '@typescript-eslint/parser', // Parser dla TypeScript
    parserOptions: {
        ecmaVersion: 2021, // Wsparcie dla nowoczesnego JavaScript
        sourceType: 'module', // Obsługa modułów ECMAScript
        ecmaFeatures: {
            jsx: true, // Obsługa JSX
        },
    },
    extends: [
        'eslint:recommended', // Zalecane reguły ESLint
        'plugin:react/recommended', // Zalecane reguły React
        'plugin:@typescript-eslint/recommended', // Zalecane reguły TypeScript
        'plugin:prettier/recommended', // Integracja Prettier
    ],
    plugins: [
        'react', // Plugin dla React
        '@typescript-eslint', // Plugin dla TypeScript
        'prettier', // Plugin dla Prettier
    ],
    rules: {
        // Własne reguły
        'prettier/prettier': 'error', // Zgłaszaj błędy stylu kodu w Prettier
        'react/react-in-jsx-scope': 'off', // Nie wymaga importu React w plikach JSX (od React 17)
        '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }], // Ostrzegaj o niewykorzystanych zmiennych (ignoruj te z prefiksem _)
        '@typescript-eslint/explicit-module-boundary-types': 'off', // Nie wymaga deklaracji typów w funkcjach eksportowanych
        'no-console': 'warn', // Ostrzegaj przy użyciu console.log
        'react/prop-types': 'off', // Wyłącz walidację propTypes (używamy TypeScript)
    },
    settings: {
        react: {
            version: 'detect', // Automatycznie wykrywa wersję React
        },
    },
    ignorePatterns: ['node_modules/', 'dist/', 'build/'], // Ignoruj katalogi
};
