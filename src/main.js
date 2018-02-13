// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'

import iView from 'iview'
import 'iview/dist/styles/iview.css'
Vue.use(iView)

import axios from 'axios'
Vue.prototype.$http = axios

import config from './config'
Vue.prototype.$config = config

import helper from './helper'
Vue.prototype.$helper = helper

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: { App },
  template: '<App/>'
})
