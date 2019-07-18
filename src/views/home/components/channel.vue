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
        >
          <span
            class="text"
            :class="{ active: index === activeIndex }"
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
