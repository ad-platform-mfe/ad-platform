import axios from 'axios'

const service = axios.create({
  baseURL: process.env.VUE_APP_BASE_API || '',
  timeout: 10000
})

// 2. 请求拦截器
service.interceptors.request.use(
  config => {
    // const token = getToken()
    // if (token) {
    //   config.headers['Authorization'] = `Bearer ${token}`
    // }
    return config
  },
  error => {
    console.log(error)
    return Promise.reject(error)
  }
)

// 3. 响应拦截器
service.interceptors.response.use(
  response => {
    const res = response.data
    if (res.code !== 200) {
      // Toast.fail(res.message || 'Error') // 弹出错误信息
      if (res.code === 500) {
        // MessageBox.confirm('您已登出，请重新登录', '确认', {
        //   confirmButtonText: '重新登录',
        //   cancelButtonText: '取消',
        //   type: 'warning'
        // }).then(() => {
        //   store.dispatch('user/resetToken').then(() => {
        //     location.reload()
        //   })
        // })
      }
      return Promise.reject(new Error(res.message || 'Error'))
    } else {
      return res
    }
  },
  error => {
    // 处理HTTP错误
    console.log('err' + error)
    return Promise.reject(error)
  }
)

export default service