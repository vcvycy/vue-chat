// polyfill
import 'babel-polyfill';

import Vue from 'vue';
import App from './App';
import store from './store';
import actions from './store';

Vue.config.devtools = true;

var cVue=new Vue({
    el: 'body',
    components: { App },
    store: store
});
window.cjf={};
window.cjf.store=store;
window.cjf.cVue=cVue;
window.cjf.actions=actions;