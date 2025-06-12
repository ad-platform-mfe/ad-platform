import http from '@/utils/http';

interface LoginParams {
  email: string;
  password?: string;
}

interface RegisterParams {
  email: string;
  password?: string;
  confirmPassword?: string;
}

interface ForgotPasswordParams {
  email: string;
}

interface ResetPasswordParams {
  email: string;
  code: string;
  password?: string;
  confirmPassword?: string;
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
const logout = (params?: any): Promise<ApiResponse> => {
  return http.get('/logout', { params });
};

// 注册接口
const register = (params: RegisterParams): Promise<ApiResponse> => {
  return http.post('/register', params);
};

// 忘记密码 - 发送验证码
const forgotPassword = (params: ForgotPasswordParams): Promise<ApiResponse> => {
  return http.post('/auth/forgot-password', params);
};

// 重置密码
const resetPassword = (params: ResetPasswordParams): Promise<ApiResponse> => {
  return http.post('/auth/reset-password', params);
};

export default {
  accountLogin,
  logout,
  register,
  forgotPassword,
  resetPassword,
};
