<template>
  <van-popup
    :value="value"
    @input="$emit('input', $event)"
    round
    position="bottom"
    :style="{ height: '93%' }">
    <!-- 我的频道 -->
    <div class="channel">
      <div class="channel-head">
        <div>
          <span class="title">我的频道</span>
          <span class="desc">点击进入频道</span>
        </div>
        <div>
          <van-button
            @click="isEdit = !isEdit"
          >{{ isEdit ? '编辑' : '完成'}}</van-button>
        </div>
      </div>
      <van-grid class="channel-content" :gutter="10" clickable>
        <van-grid-item
          v-for="(item, index) in userChannels"
          :key="item.id"
          @click="handleChangeUserChannels(item, index)"
        >
          <span
            class="text"
            :class="{ active: index === activeIndex && !isEdit}"
          >{{ item.name }}</span>
          <van-icon v-show="isEdit" class="close-icon" name="close" />
        </van-grid-item>
      </van-grid>
    </div>
    <!-- /我的频道 -->
     <!-- 推荐频道 -->
    <div class="channel">
      <div class="channel-head">
        <div>
          <span class="title">频道推荐</span>
          <span class="desc">点击添加频道</span>
        </div>
      </div>
      <van-grid class="channel-content" :gutter="10" clickable>
        <van-grid-item
         v-for="item in recomendChannels"
         :key="item.id"
         @click="handleAddChannels(item)"
        >
        <div class="info">
          <span class="text">{{ item.name }}</span>
        </div>
        </van-grid-item>
      </van-grid>
    </div>
    <!-- /推荐频道 -->
  </van-popup>
</template>
<script>
import { getAllChannels } from '@/api/channel'
import { mapState } from 'vuex'
export default {
  name: 'homeChannel',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    userChannels: {
      type: Array,
      default: () => [] // 默认返回一个数组
    },
    activeIndex: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      allChannels: [], // 存放所有频道列表数据
      isEdit: false
    }
  },
  computed: {
    /**
     * 过滤出不包含用户频道列表的列表数据
     * 计算属性会监视内部依赖的实例中的成员，当数据发生改变，会重新调用计算属性
     */
    recomendChannels () {
      // 从用户频道列表中映射出一个数组，数组中存储了所有用户频道列表的id
      const duplicates = this.userChannels.map(item => item.id)
      return this.allChannels.filter(item => !duplicates.includes(item.id))
    },
    // vuex的辅助方法，用来将state中的数据映射到本地计算属性中
    // 说白了user = this.$store.state.user
    ...mapState(['user'])
  },
  created () {
    this.loadAllChannels()
  },
  methods: {
    // 加载所有频道列表（从接口中拿到的所有频道列表数据）
    async loadAllChannels () {
      const data = await getAllChannels()
      data.channels.forEach(item => {
        item.articles = [] // 用来存储当前文章的列表
        item.timestamp = Date.now() // 存储下一页数据的时间戳
        item.downPullLoading = false // 控制当前频道的下拉刷新 loading 状态
        item.upPullLoading = false // 控制当前频道的上拉加载更多的 loading 状态
        item.upPullFinished = false // 控制当前频道数据是否加载完毕
      })
      this.allChannels = data.channels
    },
    // 频道推荐添加到我的频道列表中
    handleAddChannels (item) {
      this.userChannels.push(item)
      // 持久化
      if (this.user) {
        // 如果用户已登录，将数据请求添加到后端
        return
      }
      // 如果用户没有登录，则将用户数据持久化到本地存储
      window.localStorage.setItem('channels', JSON.stringify(this.userChannels))
    },
    // 非编辑状态改变频道
    handleChangeChannels (item, index) {
      // console.log('changechannel')
      this.$emit('update:active-index', index) // 发布一个自定义事件
      this.$emit('input', false)
    },
    // 编辑状态删除频道
    handleDeleteChannels (item, index) {
      // console.log('deletechannel')
      this.userChannels.splice(index, 1)
      if (this.user) {
        return
      }
      window.localStorage.setItem('channels', JSON.stringify(this.userChannels))
    },
    handleChangeUserChannels (item, index) {
      // 未编辑状态,在首页中跳转到对应频道列表的数据并且关闭popup弹出框
      if (!this.isEdit) {
        this.handleChangeChannels(item, index)
      } else {
        // 编辑状态，删除用户频道列表
        this.handleDeleteChannels(item, index)
      }
    }
  }
}
</script>
<style lang="less" scoped>
.channel {
  .text {
    font-size: 24px;
  }
  .channel-head {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    .title {
      font-size: 40px;
      margin-right: 5px;
    }
    .desc {
      font-size: 28px;
    }
  }
  .channel-content {
    .active {
      color: red;
    }
    .close-icon {
      font-size: 30px;
      position: absolute;
      top: -5px;
      right: -5px;
      z-index: 999;
      background-color: #fff;
    }
    .info {
      display: flex;
      align-items: center;
    }
  }
}

</style>
