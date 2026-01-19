/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['images.unsplash.com', 'picsum.photos', 'avatars.githubusercontent.com'], // Agrega tus dominios de imágenes
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**', // Permite todas las imágenes externas
      },
    ],
  },
  // Si usas TypeScript con Prisma
  typescript: {
    ignoreBuildErrors: false,
  },
}

module.exports = nextConfig