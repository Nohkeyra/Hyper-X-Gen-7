

import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, __dirname, '');

    const geminiKey = env.GEMINI_API_KEY || env.VITE_GEMINI_API_KEY || '';
    // Removed automatic loading of HF_TOKEN from env vars
    const modelId   = env.MODEL_ID || env.VITE_MODEL_ID || 'black-forest-labs/FLUX.1-schnell';

    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
        open: true,
      },
      plugins: [react()],
      define: {
        'process.env.APP_VERSION':          JSON.stringify(process.env.npm_package_version || '7.6.1'),
        'process.env.API_KEY':              JSON.stringify(geminiKey),
        'process.env.HF_TOKEN':             JSON.stringify(''), // Explicitly empty, only user input in settings is allowed
        'process.env.VITE_HF_API_KEY':      JSON.stringify(''), // Explicitly empty
        'process.env.HUGGING_FACE_API_KEY': JSON.stringify(''), // Explicitly empty
        'process.env.MODEL_ID':             JSON.stringify(modelId),
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
          '@components': path.resolve(__dirname, 'components'),
          '@hooks':      path.resolve(__dirname, 'hooks'),
          '@services':   path.resolve(__dirname, 'services'),
          '@utils':      path.resolve(__dirname, 'utils'),
          '@presets':    path.resolve(__dirname, 'presets'),
        }
      },
      build: {
        outDir: 'Appsgeyser',
        emptyOutDir: true,
        assetsDir: 'assets',
        base: './',
        rollupOptions: {
          output: {
            chunkFileNames: 'assets/[name]-[hash].js',
            entryFileNames: 'assets/[name]-[hash].js',
            assetFileNames: 'assets/[name]-[hash].[ext]',
          }
        }
      }
    };
});
