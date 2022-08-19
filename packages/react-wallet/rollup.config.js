import commonjs from '@rollup/plugin-commonjs';
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import path from 'path';
import dts from 'rollup-plugin-dts';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import postcss from 'rollup-plugin-postcss';

import packageJson from './package.json';

// eslint-disable-next-line import/no-anonymous-default-export
export default [
  {
    input: './src/index.ts',
    output: [
      {
        file: packageJson.main,
        format: 'cjs',
        sourcemap: true,
      },
      {
        file: packageJson.module,
        format: 'esm',
        sourcemap: true,
      },
    ],
    plugins: [
      peerDepsExternal(),
      resolve(),
      commonjs(),
      typescript(),
      postcss({
        config: {
          path: path.resolve('postcss.config.js'),
        },
        extract: path.resolve('dist/index.css'),
        plugins: [
          require('tailwindcss'),
          require('autoprefixer'),
          require('postcss-add-root-selector')({
            rootSelector: '.flair-wallet-component',
          }),
        ],
      }),
    ],
  },
  {
    input: 'src/index.ts',
    output: [{ file: 'dist/types.d.ts' }],
    external: [/\.css$/u],
    plugins: [dts({})],
  },
];
