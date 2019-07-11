import Vue from 'vue'
import Vuex from 'vuex'
import * as auth from '@/utils/auth'
Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    user: auth.getUser()
  },
  mutations: {
    /**
     * 登录成功。调用mutation 更新容器中的user的状态
     */
    setUser (state, data) {
      state.user = data
      // 将数据放到本地存储
      auth.saveUser(state.user)
    }
  },
  actions: {

  }
})
