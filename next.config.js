const { NextFederationPlugin } = require("@module-federation/nextjs-mf");

/** @type {import('next').NextConfig} */

const nextConfig = {
  reactStrictMode: true,
  compiler: {
    styledComponents: true,
  },
  webpack: (config, options) => {
    const { isServer } = options;

    config.experiments = { topLevelAwait: true };
    config.plugins.push(
      new NextFederationPlugin({
        name: "manufacturing",
        remotes: {
          main: `main@http://localhost:3022/_next/static/${
            isServer ? "ssr" : "chunks"
          }/primaryEntry.js`,
        },
        filename: "static/chunks/remoteEntry.js",
        exposes: {
          "./pages/tools": "./src/pages/IndustrialMaitenance/Tools",
        },
        extraOptions: {
          exposePages: true,
        },
      })
    );

    return config;
  },

  // devtool: "source-map",
};

module.exports = nextConfig;
