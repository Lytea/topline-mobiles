<template>
  <div id="app">
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
  </div>
</template>
<script>
export default {
  data () {
    return {
      user: {
        mobile: '',
        code: ''
      }
    }
  }
}
</script>
<style lang="less" scoped>

</style>
