module.exports = {
    "extends": "eslint:recommended",
    "env": {
        "browser": true,
        "commonjs": true,
		"es6": true,
		"react-native/react-native": true
    },
    "extends": "eslint:recommended",
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true
        },
        "ecmaVersion": 2018,
        "sourceType": "module"
    },
    "parser": "babel-eslint",
    "plugins": [
		"react",
        "react-native",
    ],
    "rules": {
        "no-console": "off",
        "no-const-assign": "error",
        "no-var": "error",
        "no-array-constructor": "error",
        "no-new-func": "error",
        "space-before-blocks": "error",
        "no-duplicate-imports": "error",
        "brace-style": "error",
        "react/jsx-uses-vars": ["error"],
        "indent": [
            "error",
			"tab",
			{SwitchCase: 1}
        ],
        "linebreak-style": [
            "error",
            "windows"
        ],
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "error",
            "always"
        ]
    }
};