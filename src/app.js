/**
 * @file entry
 * @author etoile(lyetoile@126.com)
 */

import Vue from 'vue';
import Vuetify from 'vuetify';
import MuseUI from 'muse-ui';
// import VueAwesomeSwiper from 'vue-awesome-swiper';
import 'muse-ui/dist/muse-ui.css';
import 'muse-ui/dist/theme-carbon.css'
import {createRouter} from './router';
import VueResource from 'vue-resource';
import store from './store';
import App from './App.vue';
import Icon from 'vue-awesome/components/Icon.vue';

Vue.use(Vuetify);
Vue.use(MuseUI);
// Vue.use(VueAwesomeSwiper);
Vue.use(VueResource);
Vue.component('icon', Icon);

Vue.config.productionTip = false;

/* eslint-disable no-new */
export function createApp() {
    let router = createRouter();
    let app = new Vue({
        router,
        store,
        ...App
    });
    return {app, router, store};
}
