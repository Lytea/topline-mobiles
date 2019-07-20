<template>
  <div>
    <!-- 导航栏 -->
    <van-nav-bar
      title="搜索结果"
      left-text="返回"
      left-arrow
      fixed
      @click-left="$router.back()"
    />
    <!-- /导航栏 -->
    <!-- 下拉列表 -->
    <van-list
      class="article-list"
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
      >
      <van-cell
          v-for="item in searchArticle"
          :key="item.art_id.toString()"
          :title="item.title"
      />
    </van-list>
    <!-- /下拉列表 -->
  </div>
</template>
<script>
import { getSearchResult } from '@/api/search'
export default {
  name: 'searchResult',
  data () {
    return {
      searchArticle: [],
      loading: false,
      finished: false,
      page: 1,
      perPage: 20
    }
  },
  computed: {
    q () {
      return this.$route.params.q
    }
  },
  // 缓存之后deactivated在离开页面时会触发的钩子函数
  deactivated () {
    // 手动销毁，禁止缓存
    this.$destroy()
  },
  methods: {
    async onLoad () {
      await this.$sleep(800)
      const data = await getSearchResult({
        page: this.page,
        perPage: this.perPage,
        q: this.q
      })
      this.searchArticle = data.results
      // 如果没有数据
      if (!data.results.length) {
        this.loading = false
        // 设置数据已加载结束
        this.finished = true
        return
      }
      // 如果有数据，将数据push到数组中加载更多
      this.searchArticle.push(...data.results)
      // 更新页码
      this.page += 1
      // 本地数据加载完毕，关闭loading(它每次onload的时候都会自动把onload设置为true)
      this.loading = false
    }
  }
}
</script>
<style lang="less" scoped>
.article-list {
  margin-top: 92px;
}
</style>
