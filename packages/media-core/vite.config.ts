import { defineConfig } from 'vite';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'MediaCore',
      formats: ['es', 'cjs'],
      fileName: (format) => `index.${format === 'es' ? 'js' : 'cjs'}`,
    },
    rollupOptions: {
      // No external dependencies — this package is intentionally zero-dep
    },
    sourcemap: true,
    target: 'es2022',
  },
  plugins: [
    dts({
      include: ['src'],
      outDir: 'dist',
    }),
  ],
});
