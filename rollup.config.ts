import typescript from '@rollup/plugin-typescript';
import { terser } from 'rollup-plugin-terser';

export default {
  input: 'src/index.ts',
  output: [
    {
      file: 'dist/sheetrock.min.js',
      format: 'umd',
      name: 'sheetrock',
    },
  ],
  plugins: [
    terser(),
    typescript(),
  ],
};
