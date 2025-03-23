/** @type {import('next').NextConfig} */

const nextConfig = {
  images: {
    domains: ["images.unsplash.com"],
  },
  transpilePackages: ["lucide-react"],
};

if (process.env.NEXT_PUBLIC_TEMPO) {
  nextConfig.experimental = {
    // NextJS 14.1.3 to 14.2.11:
    swcPlugins: [[require.resolve("tempo-devtools/swc/0.90"), {}]],
  };
}

export default nextConfig; // Changed from module.exports to export default