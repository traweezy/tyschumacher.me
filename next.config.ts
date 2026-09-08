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
    {
      source: "/tyler-schumacher-resume.pdf",
      destination: "/Tyler_Schumacher_Resume.pdf",
      permanent: true,
    },
  ],
  headers: async () => [
    {
      source: "/Tyler_Schumacher_Resume.pdf",
      headers: [
        {
          key: "Content-Disposition",
          value: 'attachment; filename="Tyler_Schumacher_Resume.pdf"',
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
