import { FlatCompat } from '@eslint/eslintrc';
import { fileURLToPath } from 'url';
import path from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

const compat = new FlatCompat({ baseDirectory: __dirname });

const eslintConfig = [
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  {
    rules: {
      '@typescript-eslint/no-unused-vars':          ['error', { argsIgnorePattern: '^_' }],
      '@typescript-eslint/no-explicit-any':          'error',
      '@typescript-eslint/consistent-type-imports':  ['warn', { prefer: 'type-imports' }],
      'react/self-closing-comp':                     'warn',
      'prefer-const':                                'error',
      'no-console':                                  ['warn', { allow: ['warn', 'error'] }],
    },
  },
];

export default eslintConfig;
