/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  env: {
    PORT: String(process.env.PORT || '3000')
  },
  webpack: (config, { isServer }) => {
    // Handle fabric.js SSR issues
    if (isServer) {
      config.externals = [...(config.externals || []), 
        { canvas: 'canvas' }, 
        { fabric: 'commonjs fabric' }
      ];
    }

    // Add a resolve alias for fabric.js to ensure consistent module resolution
    config.resolve.alias = {
      ...config.resolve.alias,
      fabric: require.resolve('fabric')
    };
    
    // Add support for using fabric.js in browser context
    if (!isServer) {
      // Remove expose loader approach as it causes problems
      // Just let fabric be imported normally
      
      // Disable minification for better compatibility
      config.optimization = {
        ...config.optimization,
        minimize: false,
      };
    }

    return config;
  }
};

module.exports = nextConfig; 