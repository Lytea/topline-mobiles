<template>
  <div>
    <van-dialog
      :value="value"
      @input="$emit('input', $event)"
      :showConfirmButton="false"
      closeOnClickOverlay
    >
    <van-cell-group v-if="!isReportShow">
      <van-cell title="不感兴趣" icon="location-o" />
      <van-cell is-link title="反馈垃圾内容" icon="location-o" @click="isReportShow = true"/>
      <van-cell title="拉黑作者" icon="location-o" />
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
export default {
  name: 'moreAction',
  props: {
    value: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      isReportShow: false // 举报列表显示状态
    }
  }

}
</script>
<style lang="less" scoped>

</style>
