// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import moment from 'moment'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import 'normalize.css/normalize.css'// A modern alternative to CSS resets
import '@/styles/c.scss'
import axios from './utils/request'
import commonJs from './utils/common'
import './components'

Vue.use(ElementUI, { size: 'mini' })

moment.locale('zh-cn');
Object.defineProperty(Vue.prototype, '$moment', { value: moment })
Object.defineProperty(Vue.prototype, '$http', { value: axios })
Object.defineProperty(Vue.prototype, '$commonJs', { value: commonJs })

import './filter'

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
