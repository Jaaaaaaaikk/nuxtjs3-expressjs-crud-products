

export default {
  target: 'server',
  modules: [
    '@nuxtjs/tailwindcss',
  ],
  buildModules: [
    '@nuxt/typescript-build',
  ],
  build: {
    postcss: {
      plugins: {
        tailwindcss: {},
        autoprefixer: {},
      },
    },
  },
  vite: {
    server: {
      proxy: {
        '/api': {
          target: 'http://localhost:3001',
          changeOrigin: true,
          rewrite: (path: string) => path.replace(/^\/api/, ''),
        },
      },
    },
  },
  debug: true,
};