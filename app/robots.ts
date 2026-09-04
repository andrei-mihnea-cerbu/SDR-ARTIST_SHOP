import type { MetadataRoute } from "next";
import { getWebsiteUrl } from "@/lib/config";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const websiteUrl = await getWebsiteUrl();

  return {
    rules: {
      userAgent: "*",
      allow: ["/", "/terms", "/merch/"],
      disallow: ["/cart", "/checkout", "/payment/"],
    },
    sitemap: `${websiteUrl}/sitemap.xml`,
  };
}
