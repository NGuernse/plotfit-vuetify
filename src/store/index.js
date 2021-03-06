import Vue from 'vue';
import Vuex from 'vuex';
import SANS from './modules/SANS/index';
import TAS from './modules/TAS/index';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    SANS,
    TAS,
  },
});
