<template>
  <div id="app">
    <form>
    <van-nav-bar title="登录"/>
    <van-cell-group>
    <van-field
        v-model="user.mobile"
        v-validate="'required'"
        name="mobile"
        :error-message="errors.first('mobile')"
        required
        clearable
        label="用户名"
        placeholder="请输入用户名"
    />
    <van-field
        v-model="user.code"
        v-validate="'required'"
        name="code"
        :error-message="errors.first('code')"
        type="password"
        label="密码"
        placeholder="请输入密码"
        required
    />
    </van-cell-group>
    <div class="login_btn">
      <van-button
        :loading="loginLoading"
        type="info"
        class="btn"
        @click.prevent="handleLogin">登录</van-button>
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
      },
      loginLoading: false // 登录禁用状态
    }
  },
  created () {
    this.configCustomMessages() // 自定义验证消息
  },
  methods: {
    async handleLogin () {
      this.loginLoading = true
      try {
        const valid = await this.$validator.validate()
        // 如果表单验证失败，则什么都不做
        if (!valid) {
          // 验证失败，代码不会往后执行，也不会抛出异常进入catch，
          // 所以也不会执行后面的loginLoading，所以验证失败后登录状态仍然为true，
          // 所以要在表单验证失败时，就让他loginLoading为false
          this.loginLoading = false
          return
        }
        // 如果表单验证通过，提交表单
        const data = await login(this.user)
        // console.log(data)
        // 通过提交mutation函数，更新vuex容器中的状态
        this.$store.commit('setUser', data)
        // 跳转到登录页面
        this.$router.push({
          name: 'home'
        })
      } catch (err) {
        console.log(err)
        console.log('登录失败')
      }
      this.loginLoading = false
    },
    // 自定义验证消息
    configCustomMessages () {
      const dict = {
        custom: {
          mobile: {
            required: '手机号不能为空'
          },
          code: {
            required: () => '验证码不能为空'
          }
        }
      }
      this.$validator.localize('zh_CN', dict)
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
