module.exports = {
	env: {
		browser: true,
		es2021: true,
	},
	extends: [
		'next/core-web-vitals',
		'xo',
		'plugin:react/recommended',
	],
	ignorePatterns: [
		'next-env.d.ts',
	],
	overrides: [
		{
			env: {
				node: true,
			},
			files: [
				'.eslintrc.{js,cjs}',
			],
			parserOptions: {
				sourceType: 'script',
			},
		},
		{
			extends: [
				'xo-typescript',
			],
			files: [
				'*.ts',
				'*.tsx',
			],
		},
	],
	parserOptions: {
		ecmaVersion: 'latest',
		sourceType: 'module',
	},
	plugins: [
		'react',
	],
	rules: {
		'capitalized-comments': 'off',
		'@typescript-eslint/indent': 'off',
		'no-console': 'off',
		'no-irregular-whitespace': 'off',
	},
	settings: {
		react: {
			version: 'detect',
		},
	},
};
