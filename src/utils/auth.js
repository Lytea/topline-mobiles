/**
 * 将操作本地存储中用户数据的信息封装为一个模块
 */
const USER_KEY = 'user'
export const getUser = () => {
  JSON.parse(window.localStorage.getItem(USER_KEY))
}

export const saveUser = (data) => {
  window.localStorage.setItem(USER_KEY, JSON.stringify(data))
}

export const removeUser = () => {
  window.localStorage.removeItem(USER_KEY)
}
