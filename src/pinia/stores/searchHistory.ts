import { defineStore } from "pinia";
import { ref } from "vue";

interface HistoryItem {
  id: string;
  keyword: string;
  timestamp: number;
}

export const useSearchHistoryStore = defineStore(
  "searchHistory",
  () => {
    // 最多保存十条记录
    const maxLength = 10;
    // 记录列表
    const histories = ref<HistoryItem[]>([]);

    // 添加记录
    const addHistory = (keyword: string) => {
      if (!keyword.trim()) return;

      // 删除相同关键词
      const existingIndex = histories.value.findIndex((item) => item.keyword === keyword);
      if (existingIndex > -1) histories.value.splice(existingIndex, 1);

      // 新纪录插入最前面
      const history = {
        id: Date.now().toString(),
        keyword: keyword.trim(),
        timestamp: Date.now(),
      };
      histories.value.unshift(history);

      if (histories.value.length > maxLength) histories.value.pop();
    };

    // 删除记录
    const deleteHistory = (id: string) => {
      const index = histories.value.findIndex((item) => item.id === id);
      histories.value.splice(index, 1);
    };

    // 清空记录
    const clearHistory = () => {
      histories.value = [];
    };

    return { maxLength, histories, addHistory, deleteHistory, clearHistory };
  },
  {
    persist: {
      key: "search-history",
      storage: localStorage,
      pick: ["histories"],
    },
  },
);
