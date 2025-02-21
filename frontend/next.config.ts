import { withNextVideo } from "next-video/process";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ["media.themoviedb.org", "image.mux.com"],
  },
};

export default withNextVideo(nextConfig);
