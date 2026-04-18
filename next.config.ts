/** @type {import('next').NextConfig} */
import withPWA from "next-pwa";

const nextConfig = {
    typescript: {
        ignoreBuildErrors: false,
    },
    eslint: {
        ignoreDuringBuilds: false,
    },
    reactStrictMode: true,
    images: {
        optimizePackageImports: ["@heroui/react"],
    },
};

export default withPWA({
    dest: "public",
    register: true,
    skipWaiting: true,
    disable: process.env.NODE_ENV === "development",
})(nextConfig);


