/** @type {import('next').NextConfig} */
const nextConfig = {
 images: {
    remotePatterns: [
      { hostname: 'github.com' },
      { hostname: 'avatars.githubusercontent.com' },
    ],
  },

  webpack(config, options) {
    // Itera sobre as regras de módulo existentes para encontrar a regra padrão de "asset/resource"
    config.module.rules.forEach((rule) => {
      // Regra 1: Altera a regra de arquivo SVG padrão do Next.js
      if (typeof rule.test !== 'undefined' && rule.test.source.includes('svg')) {
        rule.exclude = /\.svg$/i;
      }

      // Regra 2: Para a regra que lida com 'asset/resource'
      if (rule.loader === 'next-swc-loader') {
        rule.options.autoDetect = true;
      }
    });

    // Adiciona o loader @svgr/webpack para o SVG
    config.module.rules.push({
      test: /\.svg$/,
      use: [
        {
          loader: '@svgr/webpack',
          options: {
            icon: true,
          },
        },
      ],
    });

    return config;
  },
};

export default nextConfig