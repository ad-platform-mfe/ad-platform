import axios, {
  type AxiosInstance,
  type InternalAxiosRequestConfig,
  type AxiosResponse,
} from 'axios';

// 创建 axios 实例
const service: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_APP_BASE_API || '',
  timeout: 10000,
});

// 请求拦截器
service.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    // 确保 headers 存在
    if (config.headers) {
      // 可以在这里添加 token 等
      // const token = getToken();
      // if (token) {
      //   config.headers['Authorization'] = `Bearer ${token}`;
      // }
    }
    return config;
  },
  (error: any) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  },
);

// 响应拦截器
service.interceptors.response.use(
  (response: AxiosResponse) => {
    const res = response.data;
    // 这里假设成功的 code 是 200，您可以根据您的后端接口调整
    if (res.code !== 200) {
      console.error('API Error:', res.message || 'Error');
      // 可以根据 res.code 做更详细的错误处理
      if (res.code === 500) {
        // 例如：处理登录过期
        // MessageBox.confirm('您已登出，请重新登录', '确认', { ... })
      }
      return Promise.reject(new Error(res.message || 'Error'));
    } else {
      // 响应成功，直接返回数据部分
      return res;
    }
  },
  (error: any) => {
    // 处理网络层面的 HTTP 错误
    console.error('Network Error:', error);
    return Promise.reject(error);
  },
);

export default service;
