import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  agentRules: false,
  reactStrictMode: true,
  reactCompiler: true,
  poweredByHeader: false,
  headers: async () => [
    {
      source: "/tyler-schumacher-resume.pdf",
      headers: [
        {
          key: "Content-Disposition",
          value: 'attachment; filename="tyler-schumacher-resume.pdf"',
        },
      ],
    },
  ],
  images: {
    formats: ["image/avif", "image/webp"],
  },
  experimental: {
    turbopackFileSystemCacheForDev: true,
  },
};

export default nextConfig;
