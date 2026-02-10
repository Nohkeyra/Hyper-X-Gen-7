
import path from 'path';
import { fileURLToPath } from 'url';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

/**
 * ESM environment fix: define __dirname using import.meta.url
 */
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
        open: true,
      },
      plugins: [react()],
      // Security: Do not explicitly map secret keys to client-side process.env in build config.
      // The system handles process.env.API_KEY injection safely.
      define: {
        'process.env.APP_VERSION': JSON.stringify(process.env.npm_package_version),
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
          '@components': path.resolve(__dirname, 'components'),
          '@hooks': path.resolve(__dirname, 'hooks'),
          '@services': path.resolve(__dirname, 'services'),
          '@utils': path.resolve(__dirname, 'utils'),
          '@presets': path.resolve(__dirname, 'presets'),
        }
      },
      build: {
        outDir: 'Appsgeyser',
        emptyOutDir: true,
        assetsDir: 'assets',
        base: './', // Ensures assets load correctly in hybrid app/CDN environments
        rollupOptions: {
          output: {
            chunkFileNames: 'assets/[name]-[hash].js',
            entryFileNames: 'assets/[name]-[hash].js',
            assetFileNames: 'assets/[name]-[hash].[ext]'
          }
        }
      },
      envPrefix: ['VITE_'], // Only expose VITE_ prefixed environment variables to client
    };
});
