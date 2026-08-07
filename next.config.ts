import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "standalone",
  poweredByHeader: false,
  devIndicators: false,
  htmlLimitedBots:
    /bot|crawler|spider|facebookexternalhit|Facebot|Twitterbot|Slackbot-LinkExpanding|Discordbot|TelegramBot|WhatsApp|SkypeUriPreview|LinkedInBot|VKShare|Viber|Line|Applebot/i,
};

export default nextConfig;
