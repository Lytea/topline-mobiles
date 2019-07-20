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
      <van-cell
        v-for="item in reportTypes"
        :key="item.value"
        :title="item.label"
        @click="handleReportArticle(item.value)"
      />
    </van-cell-group>
    </van-dialog>
  </div>
</template>
<script>
import { dislikeArticle, reportArticle } from '@/api/article'
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
      isReportShow: false, // 举报列表显示状态
      reportTypes: [
        { label: '其他问题', value: 0 },
        { label: '标题夸张', value: 1 },
        { label: '低俗色情', value: 2 },
        { label: '错别字多', value: 3 },
        { label: '旧闻重复', value: 4 },
        { label: '广告软文', value: 5 },
        { label: '内容不实', value: 6 },
        { label: '涉嫌违法犯罪', value: 7 },
        { label: '侵权', value: 8 }
      ]
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
    // 加入黑名单
    async handleAddBlankList () {
      try {
        await addBlankList(this.currentArticle.aut_id)
        // 把当前点击的文章加入黑名单
        this.$emit('add-blanklike-success')
      } catch (err) {
        this.$toast.fail('操作失败')
      }
    },
    // 举报文章
    async handleReportArticle (type) {
      try {
        await reportArticle({
          articleId: this.currentArticle.art_id,
          type
        })
        this.$toast('举报成功')
        this.$emit('input', false) // 关闭对话框
        // 事件不是强制的，我只是给你提供了，用不用是你的事
        this.$emit('report-success')
      } catch (err) {
        if (err.response && err.response.status === 409) {
          this.$toast('该文章已被举报过')
          this.$emit('input', false)
        } else {
          this.$toast.fail('操作失败')
        }
      }
    }
  }
}
</script>
<style lang="less" scoped>

</style>
