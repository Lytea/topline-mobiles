<template>
  <div>
    <van-dialog
      :value="value"
      @input="$emit('input', $event)"
      :showConfirmButton="false"
      closeOnClickOverlay
    >
    <van-cell-group v-if="!isReportShow">
      <van-cell title="不感兴趣" icon="location-o" @click="handleDislike"/>
      <van-cell is-link title="反馈垃圾内容" icon="location-o" @click="isReportShow = true"/>
      <van-cell title="拉黑作者" icon="location-o" @click="handleAddBlankList"/>
    </van-cell-group>
    <van-cell-group v-else>
      <van-cell icon="arrow-left" @click="isReportShow = false"/>
      <van-cell  title="反馈垃圾内容" />
      <van-cell title="拉黑作者" />
      <van-cell title="拉黑作者" />
      <van-cell title="拉黑作者" />
      <van-cell title="拉黑作者" />
      <van-cell title="拉黑作者" />
      <van-cell title="拉黑作者" />
      <van-cell title="拉黑作者" />
    </van-cell-group>
    </van-dialog>
  </div>
</template>
<script>
import { dislikeArticle } from '@/api/article'
import { addBlankList } from '@/api/user'
export default {
  name: 'moreAction',
  props: {
    value: {
      type: Boolean,
      default: false
    },
    currentArticle: {
      type: Object
    }
  },
  data () {
    return {
      isReportShow: false // 举报列表显示状态
    }
  },
  methods: {
    async handleDislike () {
    //   console.log(this.currentArticle)
      try {
        await dislikeArticle(this.currentArticle.art_id)
        // 移除客户端的那个文章
        this.$emit('dislike-success')
      } catch (err) {
        this.$toast.fail('操作失败')
      }
    },
    async handleAddBlankList () {
      try {
        await addBlankList(this.currentArticle.aut_id)
        // 把当前点击的文章加入黑名单
        this.$emit('add-blanklike-success')
      } catch (err) {
        this.$toast.fail('操作失败')
      }
    }
  }
}
</script>
<style lang="less" scoped>

</style>
