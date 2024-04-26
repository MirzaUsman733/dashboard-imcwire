/** @type {import('next').NextConfig} */
module.exports = {
  // webpack: (config, { isServer }) => {
  //   if (isServer) {
  //     config.resolve.alias['https://localhost:3000'] = require('path').resolve(__dirname, '.https');
  //   }
  //   return config;
  // },
  // server: {
  //   https: {
  //     key: require('fs').readFileSync('.https/localhost-key.pem'),
  //     cert: require('fs').readFileSync('.https/localhost.pem'),
  //   },
  // },
    images: {
      unoptimized: true,
    },
    
   
  }
  const nextConfig = {
    experimental: {
      serverActions: true,
    },
  };
  


// /** @type {import('next').NextConfig} */
// module.exports = {
//   // ... other Next.js configuration options

//   webpack: (config, { isServer }) => {
//     if (isServer) {
//       config.resolve.alias['https-localhost'] = require('path').resolve(__dirname, '.https');
//     }
//     return config;
//   },

//   server: {
//     https: {
//       key: require('fs').readFileSync('.https/localhost-key.pem'),
//       cert: require('fs').readFileSync('.https/localhost.pem'),
//     },
//   },
// };