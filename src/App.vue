<template>
  <div id="app">
    <keep-alive>
      <router-view/>
    </keep-alive>
  </div>
</template>
<script>
export default {
  data () {
    return {
      radio: '1'
    }
  }
}
</script>

<style lang="less">

</style>
