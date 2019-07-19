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
// 配置相对时间
import 'dayjs/locale/zh-cn' // 加载中文语言包
// dayjs相对时间插件
import relativeTime from 'dayjs/plugin/relativeTime'
import dayjs from 'dayjs'
dayjs.extend(relativeTime) // 把插件注册到dayjs中
dayjs.locale('zh-cn') // 配置使用中文语言包
/**
 * 注册一个全局过滤器来处理日期格式的显示
 * 过滤器就是一个函数，我们可以再模板中通过 {{ 数据 | 过滤器 }}来调用这个过滤器函数
 * 过滤器函数接收的参数就是你的数据，返回值就会绑定输出到使用的位置
 * 它是一个全局函数，任何组件都可以去使用这个定义的过滤器函数
 */
Vue.filter('relativeTime', value => {
  return dayjs().from(value)
  // return 123
})
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
