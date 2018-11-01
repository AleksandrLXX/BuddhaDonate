// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import FastClick from 'fastclick'
import VueRouter from 'vue-router'
import App from './App'
// import Home from './components/HelloFromVux'
import Home from './components/Home'
import Special from './components/Special'
import Normal from './components/Normal'
import { Flexbox, FlexboxItem } from 'vux'
import { XButton } from 'vux'
import VueAwesomeSwiper from 'vue-awesome-swiper'

// require styles
import 'swiper/dist/css/swiper.css'

import { Group } from 'vux'
import { XInput } from 'vux'
import { XNumber } from 'vux'

Vue.component('x-number', XNumber)
Vue.component('x-input', XInput)
Vue.component('group', Group)

Vue.component('x-button', XButton)
Vue.use(VueAwesomeSwiper)
Vue.component('flexbox', Flexbox)
Vue.component('flexbox-item', FlexboxItem)
Vue.use(VueRouter)

const routes = [
{
	path: '/',
	component: Home
},{
	path:'/special/:id',
	component:Special,
	props:true,

},{
	path:'/normal',
	component:Normal,

}]

const router = new VueRouter({
  routes
})

FastClick.attach(document.body)

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  router,
  render: h => h(App)
}).$mount('#app-box')
