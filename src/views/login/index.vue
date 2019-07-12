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
  created () {
    this.configCustomMessages() // 自定义验证消息
  },
  methods: {
    async handleLogin () {
      try {
        this.$validator.validate().then(async valid => {
          // 如果表单验证失败，则什么都不做
          if (!valid) {
            return
          }
          // 如果表单验证通过，提交表单
          const data = await login(this.user)
          // console.log(data)
          // 通过提交mutation函数，更新vuex容器中的状态
          this.$store.commit('setUser', data)
        })
      } catch (err) {
        console.log(err)
        console.log('登录失败')
      }
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
