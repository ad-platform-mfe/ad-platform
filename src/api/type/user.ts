export interface LoginParams {
  username: string;
  password?: string;
}

export interface RegisterParams {
  email: string;
  password?: string;
  confirmPassword?: string;
}

export interface ForgotPasswordParams {
  email: string;
}

export interface ResetPasswordParams {
  email: string;
  code: string;
  password?: string;
  confirmPassword?: string;
}

export interface SendCodeParams {
  email: string;
}

export interface LoginWithCodeParams {
  email: string;
  code: string;
}

// 定义 API 响应的基础结构
export interface ApiResponse<T = any> {
  code: number;
  message: string;
  data: T;
}
