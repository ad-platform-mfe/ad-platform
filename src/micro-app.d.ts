/**
 * 为 micro-app 库扩充类型定义
 * 解决官方类型缺失 esmodule 属性的问题
 */
import 'micro-app';

declare module '@micro-zoe/micro-app' {
  interface Module {
    esmodule?: boolean;
  }
}
