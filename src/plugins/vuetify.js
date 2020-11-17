import Vue from 'vue';
import Vuetify from 'vuetify/lib';

Vue.use(Vuetify);

export default new Vuetify({
  icons: {
    values: {
      code: 'icon icon-code',
      file: 'icon icon-file',
      link: 'icon icon-link',
    },
  },
});
