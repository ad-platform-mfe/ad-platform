import http from '@/utils/http';

export function getMe() {
  return http.request({
    url: '/auth/me',
    method: 'get',
  });
}
