import type { MetadataRoute } from "next";

const manifest = (): MetadataRoute.Manifest => ({
  name: "Tyler Schumacher · Product engineering",
  short_name: "Tyler Schumacher",
  description: "Independent projects, engineering experience, and ways to get in touch.",
  start_url: "/",
  display: "browser",
  background_color: "#faf8f5",
  theme_color: "#3c3fc7",
  icons: [
    { src: "/icon-192.png", sizes: "192x192", type: "image/png" },
    { src: "/icon-512.png", sizes: "512x512", type: "image/png" },
  ],
});
export default manifest;
