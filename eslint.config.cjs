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
        'no-debugger': 'warn', // O
        'no-alert': 'warn', // Ostrzegaj przy użyciu alert
        'no-unused-vars': 'off', // Wyłącz ostrzeżenie o nieużywanych zmiennych
        'no-undef': 'off', // Wyłącz ostrzeżenie o niezadeklarowanych zmiennych
        'no-restricted-globals': 'off', // Wyłącz ograniczenia globalne
        'no-prototype-builtins': 'off', // Wyłącz ostrzeżenie o metodach prototypu
        'no-restricted-syntax': 'off', // Wyłącz ograniczenia składni
        'no-use-before-define': 'off', // Wyłącz ostrzeżenie o użyciu zmiennych przed deklaracją
        'no-underscore-dangle': 'off', // Wyłącz ostrzeżenie o użyciu podkreślników
        'no-plusplus': 'off', // Wyłącz ostrzeżenie o inkrementacji/dekrementacji
        'no-param-reassign': 'off', // Wyłącz ostrzeżenie o przypisywaniu wartości parametrom
        'no-shadow': 'off', // Wyłącz ostrzeżenie o zasłanianiu zmiennych
        'no-unused-expressions': 'off', // Wyłącz ostrzeżenie o nieużywanych wyrażeniach
        'no-nested-ternary': 'off', // Wyłącz zagnieżdżone wyrażenia warunkowe
        'no-continue': 'off', // Wyłącz instrukcje continue
        'no-else-return': 'off', // Wyłącz else po return
        'no-constant-condition': 'off', // Wyłącz stałe warunki
        'no-void': 'off', // Wyłącz void
        'no-return-assign': 'off', // Wyłącz przypisanie w return
        'no-prototype-builtins': 'off', // Wyłącz metody prototypu
        'no-undef': 'off', // Wyłącz niezadeklarowane zmienne
        'no-useless-catch': 'off', // Wyłącz zbędne catch
        'no-useless-escape': 'off', // Wyłącz zbędne ucieczki
        'no-useless-concat': 'off', // Wyłącz zbędne konkatenacje
        'no-useless-return': 'off', // Wyłącz zbędne return
        'react/prop-types': 'off', // Wyłącz walidację propTypes (używamy TypeScript)
    },
    settings: {
        react: {
            version: 'detect', // Automatycznie wykrywa wersję React
        },
    },
    ignorePatterns: ['node_modules/', 'dist/', 'build/'], // Ignoruj katalogi
};
