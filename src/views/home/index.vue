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
            <van-list
              v-model="loading"
              :finished="finished"
              finished-text="没有更多了"
              @load="onLoad"
            >
              <van-cell
                v-for="item in list"
                :key="item"
                :title="item"
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
        item.downPullLoading = false // 控制当前频道的下拉刷新状态
        item.upPullLoading = false // 控制当前频道的上拉加载数据的状态
        item.upPullFinished = false // 控制当前频道数据是否加载完毕
      })
      this.channels = channel // 把修改channel的数据赋给外面定义的channels
    },
    // 上拉加载数据
    onLoad () {
      // 异步更新数据
      setTimeout(() => {
        for (let i = 0; i < 10; i++) {
          this.list.push(this.list.length + 1)
        }
        // 加载状态结束
        this.loading = false

        // 数据全部加载完成
        if (this.list.length >= 40) {
          this.finished = true
        }
      }, 3000)
    },
    // 下拉刷新列表数据
    onRefresh () {
      console.log('onRefresh')
      setTimeout(() => {
        this.isLoading = false
      }, 3000)
    }
  }
}
</script>
<style lang="less" scoped>
.channel-tabs{
  margin-bottom: 100px;
}
.channel-tabs /deep/ .van-tabs__wrap {
  position: fixed;
  margin-top: 100px;
}
.van-list {
  margin-top: 100px;
}
</style>
