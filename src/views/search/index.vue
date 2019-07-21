<template>
  <div>
    <!-- show-action表示是否显示右边的取消按钮 -->
    <form action="/">
      <van-search
        placeholder="请输入搜索关键词"
        v-model="searchText"
        show-action
        @search="handleSearch(searchText)"
      />
    </form>
    <!-- 联想建议 -->
    <van-cell-group v-if="suggestions.length && searchText.length">
      <van-cell
        v-for="item in suggestions"
        :key="item"
        :title="item"
        icon="search"
        @click="handleSearch(item)"
      >
        <div slot="title" v-html="highLight(item, searchText)"></div>
      </van-cell>
    </van-cell-group>
    <!-- /联想建议 -->
    <!-- 历史记录 -->
    <van-cell-group v-else>
      <van-cell title="历史记录">
        <!-- 非删除状态展示 -->
        <van-icon
          v-show="!isDeleteShow"
          slot="right-icon"
          name="delete"
          style="line-height: inherit;"
          @click="isDeleteShow = true"
        />
        <!-- 删除状态显示 -->
        <div v-show="isDeleteShow">
          <span style="margin-right: 10px;">全部删除</span>
          <!-- 把删除状态切换为非删除状态 -->
          <span @click="isDeleteShow = false">完成</span>
        </div>
      </van-cell>
      <!-- 删除状态显示 -->
      <van-cell
        v-for="item in searchHistories"
        :key="item"
        :title="item">
        <van-icon
          v-show="isDeleteShow"
          slot="right-icon"
          name="close"
          style="line-height: inherit;"
        />
      </van-cell>
    </van-cell-group>
    <!-- /历史记录 -->
  </div>
</template>
<script>
import { getSuggestion } from '@/api/search'
import { debounce } from 'lodash'
export default {
  name: 'search',
  data () {
    return {
      searchText: '', // 搜索框文字
      suggestions: [], // 联想建议
      isDeleteShow: false, // 全部删除 完成和删除的状态
      searchHistories: JSON.parse(window.localStorage.getItem('search-histories')) || []// 存储历史记录
    }
  },
  watch: {
    /**
       * 监视输入数据的改变，当数据发生改变，发请求获取搜索联想建议，展示到列表中
       */
    searchText: debounce(async function (newVal) {
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
    }, 500),
    searchHistories () {
      const data = JSON.stringify(this.searchHistories)
      window.localStorage.setItem('search-histories', data)
    }
  },
  methods: {
    // 关键字高亮
    highLight (text, keyword) {
      return text.toLowerCase().split(keyword).join(`<span style="color: red">${keyword}</span>`)
    },
    handleSearch (queryText) {
      if (!queryText.length) {
        return
      }
      // 记录搜索历史记录
      const data = new Set(this.searchText)
      data.add(queryText)
      this.searchHistories = [...data]
      // 路由跳转
      this.$router.push({
        name: 'search-result',
        params: {
          q: queryText
        }
      })
    }
  }
}
</script>
<style lang="less" scoped>

</style>
