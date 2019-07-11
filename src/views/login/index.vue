<template>
  <div id="app">
    <form>
    <van-nav-bar title="登录"/>
    <van-cell-group>
    <van-field
        v-model="user.mobile"
        required
        clearable
        label="用户名"
        placeholder="请输入用户名"
    />
    <van-field
        v-model="user.code"
        type="password"
        label="密码"
        placeholder="请输入密码"
        required
    />
    </van-cell-group>
    <div class="login_btn">
      <van-button type="info" class="btn" @click.prevent="handleLogin">登录</van-button>
    </div>
    </form>
  </div>
</template>
<script>
import { login } from '@/api/user'
export default {
  name: 'LoginIndex',
  data () {
    return {
      user: {
        mobile: '14797356373',
        code: '246810'
      }
    }
  },
  methods: {
    async handleLogin () {
      try {
        const data = await login(this.user)
        // console.log(data)
        this.$store.commit('setUser', data)
      } catch (err) {
        console.log(err)
        console.log('登录失败')
      }
    }
  }
}
</script>
<style lang="less" scoped>
.btn {
    width: 100%;
    text-align: center;
}
</style>
