import * as Vue from 'vue';
import { createPinia } from 'pinia';

import App from './apps/chat/App.vue';

const pinia = createPinia();

Vue.createApp(App).use(pinia).mount('#app');
