import type { NextConfig } from "next";

const isGithubActions = process.env.GITHUB_ACTIONS || false;
let repo = "";
if (isGithubActions) {
  const repoName = process.env.GITHUB_REPOSITORY?.replace(/.*?\//, "");
  repo = `/${repoName}`;
}

const nextConfig: NextConfig = {
  output: isGithubActions ? "export" : undefined,
  basePath: isGithubActions ? repo : undefined,
  assetPrefix: isGithubActions ? repo : undefined,
  images: {
    unoptimized: true,
  },
};

export default nextConfig;
