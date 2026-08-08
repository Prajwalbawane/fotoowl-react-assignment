import { defineConfig } from 'vite';
import { resolve } from 'path';
import dts from 'vite-plugin-dts';

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'MediaReact',
      formats: ['es', 'cjs'],
      fileName: (format) => `index.${format === 'es' ? 'js' : 'cjs'}`,
    },
    rollupOptions: {
      external: ['react', 'react/jsx-runtime', '@headless-media/core'],
      output: {
        globals: {
          react: 'React',
          'react/jsx-runtime': 'ReactJSXRuntime',
          '@headless-media/core': 'MediaCore',
        },
      },
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
