import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.supabase.co" },
      { protocol: "https", hostname: "res.cloudinary.com" },
      { protocol: "https", hostname: "**.zara.com" },
      { protocol: "https", hostname: "**.zalando.com" },
      { protocol: "https", hostname: "**.asos.com" },
      { protocol: "https", hostname: "**.hm.com" },
      { protocol: "https", hostname: "**.stories.com" },
      { protocol: "https", hostname: "images.unsplash.com" },
      { protocol: "https", hostname: "**.googleusercontent.com" },
      { protocol: "https", hostname: "shopping.googleapis.com" },
      { protocol: "https", hostname: "**.serpapi.com" },
      { protocol: "https", hostname: "encrypted-tbn*.gstatic.com" },
      { protocol: "https", hostname: "**.vercel.app" },
    ],
  },
};

export default nextConfig;
