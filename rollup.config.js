import babel from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
import { terser } from 'rollup-plugin-terser';

// eslint-disable-next-line @typescript-eslint/no-var-requires
const packageJson = require('./package.json');
const production = !process.env.ROLLUP_WATCH;
export default {
  input: 'src/index.ts',
  external: ['react'],
  output: [
    {
      file: packageJson.main,
      format: 'cjs',
      sourcemap: false,
    },
    {
      file: packageJson.module,
      format: 'esm',
      sourcemap: false,
    },
  ],
  plugins: [
    babel({
      babelHelpers: 'bundled',
      exclude: 'node_modules/**',
    }),
    resolve(),
    commonjs({
      namedExports: { react: ['createElement', 'Component'] },
    }),
    typescript({ useTsconfigDeclarationDir: true }),
    production && terser({ format: { comments: false } }),
  ],
};
