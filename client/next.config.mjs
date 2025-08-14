/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  eslint: {
    // This will ignore ESLint errors during builds
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: { esmExternals: true },
  webpack: (config, { isServer }) => {
    config.module.rules.push({
      test: /\.mjs$/,
      include: /node_modules/,
      type: "javascript/auto",
    });
    return config;
  },
  experimental: {
    esmExternals: true,
  },
  transpilePackages: ["onnxruntime-web"],
};

export default nextConfig;
