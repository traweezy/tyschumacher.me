import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";
// Do not publish build-time timestamps as if the content changed every deploy.
const sitemap = (): MetadataRoute.Sitemap => [
  { url: `${SITE_URL}/`, changeFrequency: "monthly", priority: 1 },
];
export default sitemap;
