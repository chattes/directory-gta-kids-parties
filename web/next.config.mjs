/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/venues/space-centre-vaughan',
        destination: '/venues/space-center-playground',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
