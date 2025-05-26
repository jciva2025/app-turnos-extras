
import type {NextConfig} from 'next';

const withPWA = require('next-pwa')({
  dest: 'public',
  register: true, // Registra el service worker automáticamente
  skipWaiting: true, // Instala el nuevo service worker tan pronto como esté listo
  // disable: process.env.NODE_ENV === 'development', // Descomenta esto para deshabilitar PWA en desarrollo si es necesario
});

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
    ],
  },
};

export default withPWA(nextConfig);
