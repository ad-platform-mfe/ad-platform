import http from '@/utils/http';

interface LoginParams {
  username: string;
  password?: string;
  [key: string]: any;
}

// 定义 API 响应的基础结构
interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
}

// 登录接口
const accountLogin = (params: LoginParams): Promise<ApiResponse> => {
  return http.post('/login', params);
};

// 登出接口
// 这里假设登出可能不需要参数，或者参数是可选的
const logout = (params?: any): Promise<ApiResponse> => {
  // 使用标准的 http.get 方法，参数通过 params 配置传递
  return http.get('/ucenter/login/logout', { params });
};

export default {
  accountLogin,
  logout,
};
