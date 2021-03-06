/**
 * 封装文章相关接口请求函数
 */
import request from '@/utils/request'
/**
 *
 *获取推荐频道列表数据
 */
export const getArticles = ({
  channelID, // 频道id
  timestamp, // 时间戳（用于分页）
  withTop // 是否包含置顶，进入页面第一次请求时要包含置顶文章，1-包含置顶，0-不包含
}) => {
  return request({
    method: 'GET',
    url: '/app/v1_1/articles',
    params: {
      channel_id: channelID,
      timestamp,
      with_top: withTop
    }
  })
}
/**
 * 对文章不喜欢
 */
export const dislikeArticle = articleId => {
  return request({
    method: 'POST',
    url: '/app/v1_0/article/dislikes',
    data: {
      target: articleId
    }
  })
}
/**
 * 举报文章
 */
export const reportArticle = ({
  articleId,
  type,
  remark = ''
}) => {
  return request({
    method: 'POST',
    url: '/app/v1_0/article/reports',
    data: {
      target: articleId,
      type,
      remark
    }
  })
}
