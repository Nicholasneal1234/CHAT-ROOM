import Vue from 'vue';
import { library, config } from '@fortawesome/fontawesome-svg-core';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import { faPaperPlane, faFaceSmile, faFaceMeh, faDisplay } from '@fortawesome/free-solid-svg-icons';

library.add(faPaperPlane, faFaceSmile, faFaceMeh, faDisplay);

config.autoAddCss = false;

Vue.component('font-awesome-icon', FontAwesomeIcon);