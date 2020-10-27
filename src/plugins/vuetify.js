import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import colors from 'vuetify/lib/util/colors';

Vue.use(Vuetify);

const vuetify = new Vuetify({
  theme: {
    dark: false,
    themes: {
      dark: {
        primary: '#FF0084',
        secondary: '#CF006B',
        info: colors.grey.darken4,
      },
      light: {
        primary: '#0063DC',
        secondary: '#004599',
        info: colors.grey.lighten4,
      },
    },
  },
});

export default vuetify;
