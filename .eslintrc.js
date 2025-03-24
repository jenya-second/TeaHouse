module.exports = {
    parser: '@typescript-eslint/parser',
    overrides: [{
      files: ['*.ts', '*.tsx'],
      extends: [
        'plugin:@typescript-eslint/recommended',
        'plugin:prettier/recommended'
      ],
      parserOptions: {
        project: '*/tsconfig**.json',
        tsconfigRootDir: __dirname,
        sourceType: 'module',
        projectService: true,
      },
      rules: {
        '@typescript-eslint/interface-name-prefix': 'off',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/no-explicit-any': 'off',
        '@typescript-eslint/no-unused-vars' : 'off',
      },
    }],
    plugins: ['@typescript-eslint/eslint-plugin'],
    root: true,
    env: {
      node: true,
      jest: true,
    },
    ignorePatterns: ['.eslintrc.js','**/dist/*','**/node_modules/*','**/build/*','**/.react-router/*'],
    extends: [
      'plugin:prettier/recommended'
    ],
  };