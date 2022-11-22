const nextTranslate = require("next-translate");
const { withSentryConfig } = require("@sentry/nextjs");
const withPlugins = require("next-compose-plugins");
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});
const withImages = require("next-images");
const path = require("path");
module.exports = {
  reactStrictMode: true,
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  ...nextTranslate(),
};

const nextConfigs = {
  images: {
    disableStaticImages: true,
  },
};

module.exports = withSentryConfig(
  withPlugins([
    [withBundleAnalyzer],
    {
      sassOptions: {
        includePaths: [path.join(__dirname, "styles")],
      },
    },
    [withImages],
    nextConfigs,
  ])
);
