<template>
  <div>
    <!-- show-action表示是否显示右边的取消按钮 -->
    <van-search
      placeholder="请输入搜索关键词"
      v-model="searchText"
      show-action
    />
    <van-cell
      v-for="item in suggestions"
      :key="item"
      :title="item"
      icon="search" />
  </div>
</template>
<script>
import { getSuggestion } from '@/api/search'
export default {
  name: 'search',
  data () {
    return {
      searchText: '', // 搜索框文字
      suggestions: [] // 联想建议
    }
  },
  watch: {
    /**
       * 监视输入数据的改变，当数据发生改变，发请求获取搜索联想建议，展示到列表中
       */
    async searchText (newVal) {
      // console.log(newVal, oldVal)
      newVal = newVal.trim()
      // 非空判断
      if (!newVal.length) {
        return
      }
      try {
        const data = await getSuggestion(newVal)
        // console.log(data)
        this.suggestions = data.options
      } catch (err) {
        console.log(err)
      }
    }
  }
}
</script>
<style lang="less" scoped>

</style>
