import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import './plugins/element.js'
import './plugins/moment.js'
import './plugins/axios.js'
import './plugins/common.js'
import 'normalize.css'// A modern alternative to CSS resets
import './styles/c.less'
import './components'
import './filter'

Vue.config.productionTip = false

new Vue({
	router,
  store,
  render: h => h(App),
}).$mount('#app')
