import http from '@/utils/http';
import type {
  LoginParams,
  RegisterParams,
  ForgotPasswordParams,
  ResetPasswordParams,
  ApiResponse,
  SendCodeParams,
  LoginWithCodeParams,
} from './type/user';

// 账号密码登录接口
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

// 发送邮箱登录验证码
const sendLoginCode = (params: SendCodeParams): Promise<ApiResponse> => {
  return http.post('/auth/code', params);
};

// 邮箱验证码登录
const loginWithCode = (params: LoginWithCodeParams): Promise<ApiResponse> => {
  return http.post('/auth/login', params);
};

export default {
  accountLogin,
  sendLoginCode,
  loginWithCode,
  logout,
  register,
  forgotPassword,
  resetPassword,
};
