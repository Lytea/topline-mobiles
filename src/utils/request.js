import axios from 'axios'
import store from '@/store'
/**
 * axios.create用于创建一个axios实例，该实例和axios的功能是一模一样的，
 * 可以说是复制了一个axios
 *
 */
const request = axios.create({
  baseURL: 'http://ttapi.research.itcast.cn/'
})

request.interceptors.request.use(function (config) {
  const { user } = store.state
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
