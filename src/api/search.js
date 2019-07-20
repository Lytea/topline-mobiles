import request from '@/utils/request'
/**
 * 获取联想建议
 */
export const getSuggestion = q => {
  return request({
    method: 'GET',
    url: '/app/v1_0/suggestion',
    params: {
      q
    }
  })
}
/**
 * 获取搜索结果
 */
export const getSearchResult = ({
  page, // 页码，不传为1
  perPage, // 每页数量
  q
}) => {
  return request({
    method: 'GET',
    url: '/app/v1_0/search',
    params: {
      page,
      per_page: perPage,
      q
    }
  })
}
