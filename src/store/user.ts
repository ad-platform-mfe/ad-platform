import { defineStore } from 'pinia';

export interface UserInfo {
  id: number;
  username: string;
  email: string;
  phone: string;
  role: 'user' | 'admin';
}

export const useUserStore = defineStore('user', {
  state: () => ({
    userInfo: null as UserInfo | null,
    token: localStorage.getItem('token') || null,
  }),
  getters: {
    isAdmin: (state) => state.userInfo?.role === 'admin',
  },
  actions: {
    setUserInfo(userInfo: UserInfo) {
      this.userInfo = userInfo;
    },
    setToken(token: string) {
      this.token = token;
      localStorage.setItem('token', token);
    },
    logout() {
      this.userInfo = null;
      this.token = null;
      localStorage.removeItem('token');
      // 可选：通知子应用登出
      window.microApp?.dispatch({ type: 'logout' });
    },
  },
});
