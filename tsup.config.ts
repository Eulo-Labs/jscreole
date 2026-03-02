import { defineConfig } from 'tsup';

export default defineConfig({
  entry: { creole: 'src/index.ts' },
  format: ['esm', 'cjs'],
  outDir: 'dist',
  outExtension({ format }) {
    return {
      js: format === 'esm' ? '.mjs' : '.cjs',
    };
  },
  dts: true,
  clean: true,
  sourcemap: true,
});
