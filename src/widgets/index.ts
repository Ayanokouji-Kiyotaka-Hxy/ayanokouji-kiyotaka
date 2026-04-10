import { defineAsyncComponent, type Component } from "vue";
import type { Widget } from "@/pinia/stores";

export type SetStaticFn = (mask: boolean) => void;

// 异步组件映射
const asyncComponentMap: Record<Widget["type"], () => Promise<Component>> = {
  shortcut: () => import("./Shortcut.vue"),
  append: () => import("./Append.vue"),
};

// 获取组件
export const getWidgetComponent = (type: Widget["type"]): Component => {
  const loader = asyncComponentMap[type];
  if (!loader) throw new Error(`Unknown widget type: ${type}`);

  return defineAsyncComponent(loader);
};
