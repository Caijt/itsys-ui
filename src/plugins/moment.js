import Vue from 'vue'
import moment from 'moment'
moment.locale('zh-cn');
Object.defineProperty(Vue.prototype, '$moment', { value: moment })
