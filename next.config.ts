import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'images.ctfassets.net', // Replace with your image domain (e.g., '://unsplash.com')
          port: '',
          pathname: '/**', // Allows all image paths from this domain
        },
        {
          protocol: 'https',
          hostname: 'lh3.googleusercontent.com', // Replace with your image domain (e.g., '://unsplash.com')
          port: '',
          pathname: '/**', // Allows all image paths from this domain
        }
      ],
    }
};

export default nextConfig;
