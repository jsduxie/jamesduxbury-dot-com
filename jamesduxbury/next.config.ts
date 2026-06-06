import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  trailingSlash: false,
  // self-contained server bundle for the Docker runner stage; Vercel is unaffected
  output: "standalone",
  images: {
    remotePatterns: [{ protocol: "https", hostname: "*.public.blob.vercel-storage.com" }],
  },
  experimental: {
    // headroom over the 4mb image cap for multipart overhead; 4.5mb is the Vercel function limit
    serverActions: { bodySizeLimit: "4.5mb" },
  },
};

export default nextConfig;
