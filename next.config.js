/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  compiler: {
    styledComponents: true,
  },
  pageExtensions: ["tsx"],
  // devtool: "source-map",
};

module.exports = nextConfig;
