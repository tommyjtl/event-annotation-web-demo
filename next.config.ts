import type { NextConfig } from "next";
// import MillionLint from "@million/lint";

// const withBundleAnalyzer = process.env.ANALYZE === 'true'
//   ? require('@next/bundle-analyzer')({ enabled: true })
//   : (config: NextConfig) => config;

const nextConfig: NextConfig = {
  // Enable compression
  compress: true,
  // Enable experimental features for better performance
  experimental: {
    optimizePackageImports: ["@dnd-kit/core"],
  },
  // Disable x-powered-by header
  poweredByHeader: false,
  // Enable static optimization
  trailingSlash: false,
  // Build export
  output: "export", // enables static export
  distDir: "out",   // output folder (default is "out")
};

// export default withBundleAnalyzer(nextConfig);
export default nextConfig;
