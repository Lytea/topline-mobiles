/**
 * 封装用户相关接口请求函数
 */
// 用户登录
import request from '@/utils/request'
export const login = ({ mobile, code }) => {
  return request({
    method: 'POST',
    url: '/app/v1_0/authorizations',
    data: {
      mobile,
      code
    }
  })
}
/**
 * 拉黑用户(加入黑名单)
 */
export const addBlankList = userId => {
  return request({
    method: 'POST',
    url: '/app/v1_0/user/blacklists',
    data: {
      target: userId
    }
  })
}
