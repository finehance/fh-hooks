import babel from '@rollup/plugin-babel';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from 'rollup-plugin-typescript2';
import { terser } from 'rollup-plugin-terser';
import packageJson from './package.json';

const production = !process.env.ROLLUP_WATCH;
export default {
  input: 'src/index.ts',
  external: [...Object.keys(packageJson.peerDependencies || {})],
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
    {
      file: 'dist/bundle.umd.js',
      format: 'umd',
      name: 'FH',
      globals: {
        react: 'React',
        'react-dom': 'ReactDOM',
      },
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
