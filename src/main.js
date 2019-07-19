import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Vant, { Lazyload } from 'vant'
import 'vant/lib/index.css'
import 'amfe-flexible'
import './styles/index.less'
// 表单验证
import zhCN from 'vee-validate/dist/locale/zh_CN'
import VeeValidate, { Validator } from 'vee-validate'

Vue.use(VeeValidate, {
  // 配置改变的时候去触发校验，默认是input
  events: ''
})
Validator.localize('zh_CN', zhCN)

Vue.use(Vant)
Vue.use(Lazyload) // 图片懒加载组件
Vue.config.productionTip = false

Vue.prototype.$sleep = time => {
  return new Promise((resolve, reject) => {
    window.setTimeout(() => {
      resolve()
    }, 500)
  })
}
new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')
