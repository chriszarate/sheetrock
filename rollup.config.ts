import typescript from '@rollup/plugin-typescript';
import { terser } from 'rollup-plugin-terser';

export default {
  external: ['cross-fetch'],
  input: 'src/index.ts',
  output: [
    {
      dir: 'dist',
      format: 'es',
      preserveModules: true,
      preserveModulesRoot: 'src',
    },
    {
      file: 'dist/sheetrock.min.js',
      format: 'umd',
      globals: {
        'cross-fetch': 'fetch',
      },
      name: 'Sheetrock',
      plugins: [terser()],
    },
  ],
  plugins: [typescript()],
};
