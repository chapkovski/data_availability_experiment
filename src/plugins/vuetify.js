/**
 * plugins/vuetify.js
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { aliases, mdi } from 'vuetify/iconsets/mdi';

// Composables
import { createVuetify } from 'vuetify'
// Import Vuetify themes if needed
export default  createVuetify({
  theme: {
    defaultTheme: 'dark',
    themes: {
      dark: {
        dark: true, // This sets the theme to dark mode
        colors: {
          primary: '#1e88e5',
          secondary: '#ff4081',
          accent: '#82B1FF',
        },
      },
    },
  },
  icons: {
    defaultSet: 'mdi',
    aliases,
    sets: {
      mdi,
    },
  },
});


// https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
// export default createVuetify({
//   //
// })
