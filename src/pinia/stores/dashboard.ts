import { defineStore } from "pinia";
import { v1 } from "uuid";
import { ref } from "vue";

export interface BaseWidget {
  id: string;
  x: number | undefined;
  y: number | undefined;
  w: number;
  h: number;
  noMove?: boolean;
  locked?: boolean;
}

export interface ShortcutWidget extends BaseWidget {
  type: "shortcut";
  name: string;
  url: string;
  icon?: string;
}

export interface WeatherWidget extends BaseWidget {
  type: "weather";
  city: string;
}

export interface AppendWidget extends BaseWidget {
  type: "append";
  id: "append";
  x: undefined;
  y: undefined;
}

export type Widget = ShortcutWidget | AppendWidget;

export const useDashBoardStore = defineStore(
  "dashboard",
  () => {
    const widgets = ref<Widget[]>([
      {
        id: v1(),
        type: "shortcut",
        x: 0,
        y: 0,
        w: 1,
        h: 1,
        name: "baidu",
        url: "https://www.baidu.com",
        icon: "https://www.favicon.org.cn/get.php?url=baidu.com&size=128&key=USR-34B1CE30EFE41274B33D720D64F82519FEF452C5",
      },
      {
        id: v1(),
        type: "shortcut",
        x: 1,
        y: 1,
        w: 1,
        h: 1,
        name: "google",
        url: "https://www.google.com",
        icon: "https://www.favicon.org.cn/get.php?url=google.com&size=128&key=USR-34B1CE30EFE41274B33D720D64F82519FEF452C5",
      },
    ]);

    return { widgets };
  },
  {
    persist: {
      key: "dashboard",
      storage: localStorage,
      pick: ["widgets"],
    },
  },
);
