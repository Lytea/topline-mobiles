import axios from 'axios'
import store from '@/store'
import JSONbig from 'json-bigint'
/**
 * axios.create用于创建一个axios实例，该实例和axios的功能是一模一样的，
 * 可以说是复制了一个axios
 *
 */
const request = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn/'
})

request.defaults.transformResponse = [function (data) {
  try {
    // data 数据可能不是标准的 JSON 格式字符串，否则会导致 JSONbig.parse(data) 转换失败报错
    return JSONbig.parse(data)
  } catch (err) {
    // 无法转换的数据直接原样返回
    return data
  }
}]

request.interceptors.request.use(function (config) {
  // 判断用户是否登录
  const { user } = store.state
  // 如果用户已登录就为请求接口统一添加用户 token
  if (user) {
    config.headers.Authorization = `Bearer ${user.token}`
  }
  return config
}, function (error) {
  return Promise.reject(error)
})
request.interceptors.response.use(function (response) {
  // 如果响应结果对象中有data数据，则直接返回这个data数据
  // 如果响应结果对象中没有data数据，则不做任何处理，直接原样返回这个数据
  return response.data.data || response.data
}, function (error) {
  return Promise.reject(error)
})

export default request
