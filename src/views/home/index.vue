<template>
  <div>
    <div class="home">
      <van-nav-bar title="首页" fixed/>
      <van-tabs class="channel-tabs" v-model="activeChannelIndex">
        <van-tab
         v-for="channelItem in channels"
         :key="channelItem.id"
         :title="channelItem.name"
        >
          <!--下拉刷新
            isLoading用来控制下拉刷新的loading状态
            下拉刷新的时候，它会自动将loading设置为true
             @refresh当下拉刷新的时候回触发-->
          <van-pull-refresh v-model="isLoading" @refresh="onRefresh">
            <!-- 列表组件：提供上拉加载更多数据的功能
            loading用来控制加载中的状态
            finished用来控制是否加载完毕
            @load加载更多的时候触发的一个事件，它自动回调用onload函数拿到数据，以填充页面
            它每次调用onload会自动将loading设置为true
            我们需要在onload中拿到本次加载的数据之后，将loading设置为false
             -->
            <!-- 这里绑定频道的上拉加载，下面的van-cell绑定频道的文章列表 -->
            <van-list
              v-model="channelItem.upPullLoading"
              :finished="channelItem.upPullFinished"
              finished-text="没有更多了"
              @load="onLoad"
            >
              <van-cell
                v-for="articleItem in channelItem.articles"
                :key="articleItem.art_id"
                :title="articleItem.title"
              />
            </van-list>
          </van-pull-refresh>

        </van-tab>
      </van-tabs>
    </div>
  </div>
</template>
<script>
import { getUserChannels } from '@/api/channel'
import { getArticles } from '@/api/article'
export default {
  name: 'homeIndex',
  data () {
    return {
      activeChannelIndex: 0,
      list: [],
      loading: false, // 用来控制加载中的状态
      finished: false, // 用来控制是否加载完毕
      isLoading: false, // 下拉刷新加载状态
      channels: [] // 用户频道列表
    }
  },
  computed: {
    // 获取当前点击的频道
    activeArticle () {
      return this.channels[this.activeChannelIndex]
    }
  },
  created () {
    this.loadChannel()
  },
  methods: {
    async loadChannel () {
      // 判断用户是否登录
      const { user } = this.$store.state
      let channel = [] // 存放本地存储列表
      if (user) {
        // 已登录
        const data = await getUserChannels()
        // console.log(data)
        channel = data.channels
      } else {
        // 未登录(判断本地存储是否有数据)
        // 如果有本地存储，就使用本地存储推荐的频道列表
        const localChannel = JSON.parse(window.localStorage.getItem('channels'))
        if (localChannel) {
          channel = localChannel
        } else {
          // 如果没有本地存储，就使用用户频道列表
          const data = await getUserChannels()
          // console.log(data)
          channel = data.channels
        }
      }
      // 修改channel数据结构，
      channel.forEach(item => {
        item.articles = [] // 用来存储当前文章的列表
        item.timestamp = Date.now() // 存储下一页数据的时间戳
        item.downPullLoading = false // 控制当前频道的下拉刷新状态
        item.upPullLoading = false // 控制当前频道的上拉加载数据的状态
        item.upPullFinished = false // 控制当前频道数据是否加载完毕
      })
      this.channels = channel // 把修改channel的数据赋给外面定义的channels
    },
    // 上拉加载数据
    async onLoad () {
      let data = []
      data = await this.loadArticle()
      // pre_timestamp 下一页的页码 results 文章列表
      // console.log(data)
      // 如果有时间戳并且results的长度为空
      // （解决初始化的时候没有最新数据的问题），那就加载上一次的频道数据
      if (data.pre_timestamp && !data.results.length) {
        this.activeArticle.timestamp = data.pre_timestamp
        // 拿到加载的下一页数据的最新数据
        data = await this.loadArticle()
      }
      // 数据加载好之后，将pre_timestamp更新到当前频道中用于加载下一个数据
      this.activeArticle.timestamp = data.pre_timestamp
      // 将文章数据加载到列表中
      this.activeArticle.articles.push(...data.results)
      // 数据加载完成，取消上拉loading
      this.activeArticle.upPullLoading = false
      // console.log(data)
      // 异步更新数据
      // setTimeout(() => {
      //   for (let i = 0; i < 10; i++) {
      //     this.list.push(this.list.length + 1)
      //   }
      //   // 加载状态结束
      //   this.loading = false

      //   // 数据全部加载完成
      //   if (this.list.length >= 40) {
      //     this.finished = true
      //   }
      // }, 3000)
    },
    // 下拉刷新列表数据
    onRefresh () {
      console.log('onRefresh')
      setTimeout(() => {
        this.isLoading = false
      }, 3000)
    },
    // （只是请求）请求当前频道相关的数据，有可能是上拉刷新的请求，也有可能是下拉加载更多的请求
    async loadArticle () {
      const { id: channelID, timestamp } = this.activeArticle
      const data = await getArticles({
        channelID, // 当前激活频道id
        timestamp, // 用于请求分页数据的时间戳
        withTop: 1 // 是否包含置顶数据
      })
      return data
    }
  }
}
</script>
<style lang="less" scoped>
.channel-tabs{
  margin-bottom: 92px;
}
.channel-tabs /deep/ .van-tabs__wrap {
  position: fixed;
  margin-top: 92px;
}
.van-list {
  margin-top: 92px;
}
</style>
