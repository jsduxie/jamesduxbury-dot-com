import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  trailingSlash: false,
  images: {
    remotePatterns: [{ protocol: "https", hostname: "*.public.blob.vercel-storage.com" }],
  },
  experimental: {
    // default 1mb is too small for image uploads; Vercel functions cap bodies at 4.5mb
    serverActions: { bodySizeLimit: "4mb" },
  },
};

export default nextConfig;
