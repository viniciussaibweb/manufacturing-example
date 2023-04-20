const { NextFederationPlugin } = require("@module-federation/nextjs-mf");
/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  // webpack: (config, options) => {
  //   const { isServer } = options;

  //   config.experiments = { topLevelAwait: true };
  //   config.plugins.push(
  //     new NextFederationPlugin({
  //       name: "manufacturing",
  //       remotes: {
  //         "auth-saibweb-front": `auth-saibweb-front@http://localhost:3022/_next/static/${
  //           isServer ? "ssr" : "chunks"
  //         }/remoteEntry.js`,
  //       },
  //       filename: "static/chunks/primaryEntry.js",
  //     })
  //   );

  //   return config;
  // },
  compiler: {
    styledComponents: true,
  },
};

module.exports = nextConfig;
