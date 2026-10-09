import type { MetadataRoute } from "next";
import { SITE } from "@/lib/constants";
export default function sitemap():MetadataRoute.Sitemap { return [{url:SITE.url,lastModified:"2026-10-09",changeFrequency:"monthly",priority:1}]; }
