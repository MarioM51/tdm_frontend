module.exports = {
  content: ["./src/**/*.{html,js,ts,svelte}"],
  theme: {
    extend: {
      minWidth: {
        'i4': '300px',
      },
    },
    daisyui: {
      themes: ["light", "dark" ]
    },

  },
  plugins: [
  require('daisyui'),
],
}
