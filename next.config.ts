import type { NextConfig } from "next";
import { SHARE_IMAGE_PATH } from "./src/lib/site";

const nextConfig: NextConfig = {
  agentRules: false,
  reactStrictMode: true,
  reactCompiler: true,
  poweredByHeader: false,
  redirects: async () => [
    {
      source: "/og-image.svg",
      destination: SHARE_IMAGE_PATH,
      permanent: true,
    },
  ],
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
