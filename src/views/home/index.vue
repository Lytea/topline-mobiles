<template>
  <div class="home">
    <van-nav-bar title="首页" fixed/>
    <van-tabs class="channel-tabs" v-model="activeChannelIndex">
        <div slot="nav-right" class="wap-nav">
          <van-icon name="wap-nav" @click="isChannelShow = true"/>
        </div>
        <van-tab
         v-for="channelItem in channels"
         :key="channelItem.id"
         :title="channelItem.name"
        >
          <!--下拉刷新
            isLoading用来控制下拉刷新的loading状态
            下拉刷新的时候，它会自动将loading设置为true
             @refresh当下拉刷新的时候回触发-->
          <van-pull-refresh
            v-model="channelItem.downPullLoading"
            :success-text="channelItem.downPullSuccessText"
            :success-duration="1000"
            @refresh="onRefresh"
          >
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
                :key="articleItem.art_id.toString()"
                :title="articleItem.title"
              >
              <div slot="label">
                <template v-if="articleItem.cover.type">
                  <van-grid :border="false" :column-num="3">
                    <van-grid-item
                      v-for="(img, index) in articleItem.cover.images"
                      :key="index"
                    >
                      <!-- 不推荐用index，但是这里不会涉及一些排序反转的问题，所以可以用index -->
                      <van-image :src="img" lazy-load />
                    </van-grid-item>
                  </van-grid>
                </template>
                <p>
                  <span>{{ articleItem.aut_name }}</span>&nbsp;
                  <span>{{ articleItem.comm_count}}评论</span>&nbsp;
                  <span>{{ articleItem.pubdate | relativeTime}}</span>
                  <van-icon class="close" name="close" @click="handleShowMoreAction(articleItem)" />
                </p>
              </div>
              </van-cell>
            </van-list>
          </van-pull-refresh>

        </van-tab>
    </van-tabs>
    <!-- 频道管理层 -->
    <!-- :active-index="activeChannelIndex" -->
    <!-- @updata:active-index="activeChannelIndex=$event" -->
    <!-- 可以简写为:active-index.sync="activeChannelIndex" -->
    <homeChannel
      v-model="isChannelShow"
      :user-channels="channels"
      :active-index="activeChannelIndex"
      @update:active-index="activeChannelIndex=$event"
    />
    <!-- /频道管理层 -->
    <!-- 更多操作例如加入黑名单不喜欢的 -->
    <moreAction
      v-model="isMoreActionShow"
      :current-article="currentArticle"
      @dislike-success="handleDislikeSuccess"
      @add-blanklike-success="handleDislikeSuccess"
    />
    <!-- /更多操作例如加入黑名单不喜欢的 -->
  </div>
</template>
<script>
import { getUserChannels } from '@/api/channel'
import { getArticles } from '@/api/article'
import homeChannel from './components/channel'
import moreAction from './components/more-action'
export default {
  name: 'homeIndex',
  components: {
    homeChannel,
    moreAction
  },
  data () {
    return {
      activeChannelIndex: 0,
      // list: [],
      // loading: false, // 用来控制加载中的状态
      // finished: false, // 用来控制是否加载完毕
      // isLoading: false, // 下拉刷新加载状态
      channels: [], // 用户频道列表
      isChannelShow: false, // popup弹出框显示状态
      isMoreActionShow: false, // 更多操作的显示状态
      currentArticle: null // 要传给moreAction组件的值（当前点击的文章）
    }
  },
  computed: {
    // 获取当前点击的频道
    activeArticle () {
      return this.channels[this.activeChannelIndex]
    }
  },
  watch: {
    /**
     * 监视容器中的user用户
     * 记住：凡是能this.出来的成员，都可以在这里监视
     * 由于路由缓存了，所以这里监视用户的登录状态，如果登录了则加载用户频道列表，
     */
    async '$store.state.user' () {
      // 重新加载用户频道列表
      this.loadChannel()
      // 频道列表改变，重新加载当前频道的数据
      this.activeArticle.upPullLoading = true // 手动加入loading效果
      await this.onLoad()
      // 解决不满一屏的问题
      // await this.onLoad()
    }
  },
  created () {
    this.loadChannel()
  },
  methods: {
    async loadChannel () {
      // 判断用户是否登录
      const { user } = this.$store.state
      let channel = [] // 存放本地存储频道列表
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
      // 修改 channels，将这个数据结构修改为满足我们使用的需求
      channel.forEach(item => {
        item.articles = [] // 用来存储当前文章的列表
        item.timestamp = Date.now() // 存储下一页数据的时间戳
        item.downPullLoading = false // 控制当前频道的下拉刷新 loading 状态
        item.upPullLoading = false // 控制当前频道的上拉加载更多的 loading 状态
        item.upPullFinished = false // 控制当前频道数据是否加载完毕
      })
      this.channels = channel // 把修改channel的数据赋给外面定义的channels
    },
    // 上拉加载数据
    async onLoad () {
      await this.$sleep(800)
      let data = []
      data = await this.loadArticle()
      // 解决上拉加载数据完毕后的提示信息
      if (!data.pre_timestamp && !data.length) {
        // 频道数据加载完毕，组件会自动给出提示，
        this.activeArticle.upPullFinished = true
        // 取消loading状态
        this.activeArticle.upPullLoading = false
        return
      }
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
    async onRefresh () {
      // 备份加载下一页数据的时间戳
      const timestamp = this.activeArticle.timestamp
      this.activeArticle.timestamp = Date.now()
      const data = await this.loadArticle()
      // 如果有数据，把数据重置到频道的文章列表中
      if (data.results.length) {
        // 将当前的最新内容重置到频道列表中
        this.activeArticle.articles = data.results
        // 由于你重置了数据，那么当前数据的pre_timestamp就是上拉加载更多的下一页数据的时间戳
        this.activeArticle.timestamp = data.pre_timestamp
        this.activeArticle.downPullSuccessText = '更新成功'
        // 如果加载时不满一屏，需要重新onload
        this.onLoad()
      } else {
        // 如果没有数据，提示“已是最新数据”信息
        this.activeArticle.downPullSuccessText = '已是最新数据'
      }
      this.activeArticle.downPullLoading = false
      // 没有最新数据，将原来的用于下一页的时间戳恢复过来
      this.activeArticle.timestamp = timestamp
      // console.log('onRefresh')
      // setTimeout(() => {
      //   this.isLoading = false
      // }, 3000)
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
    },
    handleShowMoreAction (article) {
      // 将执行更多操作的文章记录起来
      // console.log(article)
      this.currentArticle = article
      // 显示更多操作的弹框
      this.isMoreActionShow = true
    },
    handleDislikeSuccess () {
      const articles = this.activeArticle.articles
      const delIndex = articles.findIndex(item => item === this.currentArticle)
      // console.log(delIndex) 拿到点击的元素和要移除的元素对应的索引
      articles.splice(delIndex, 1) // 移除当前元素
      // 关闭举报列表
      this.isMoreActionShow = false
      // 提示成功
      this.$toast('操作成功')
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
.wap-nav {
  position: fixed;
  right: 0;
}
.channel-tabs .close {
  float: right;
  font-size: 30px;
}
</style>
