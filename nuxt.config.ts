export default defineNuxtConfig({
  ssr: true,
  modules: [],
  devtools: { enabled: true },
  css: ['~/tailwindcss/main.css'],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
});