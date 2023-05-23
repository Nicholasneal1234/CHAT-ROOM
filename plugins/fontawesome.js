import Vue from 'vue';
import { library, config } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faPaperPlane } from '@fortawesome/free-solid-svg-icons';

library.add(faPaperPlane);

config.autoAddCss = false;

Vue.component('font-awesome-icon', FontAwesomeIcon);