<template>
  <div class="search-container">
    <div class="search-box">
      <!-- 搜索引擎下拉 -->
      <div ref="selectorRef" class="engine-selector">
        <button class="selected" @click="toggleChoosingEngine">
          <ak-icon :size="25">
            <component :is="selectedEngine.component"></component>
          </ak-icon>
          <span class="arrow">▼</span>
        </button>
      </div>

      <!-- 输入框容器 -->
      <div ref="inputRef" class="input-wrapper">
        <!-- 输入框 -->
        <input
          ref="inputRef"
          type="text"
          v-model="keyword"
          placeholder="输入搜索内容"
          class="search-input"
          @focus="showSearchHistory = true"
          @keyup.enter="handleSearch(keyword)"
        />
        <!-- 清空按钮 -->
        <button
          v-if="keyword.length > 0"
          class="clear-btn"
          @click="clearInput"
          aria-label="清空输入"
        >
          ×
        </button>
      </div>
    </div>

    <!-- 下拉搜索引擎列表 -->
    <transition>
      <div ref="engineDropdownRef" v-if="showSearchEngine" class="engines">
        <div
          v-for="engine in engines"
          :key="engine.value"
          class="engine-item"
          @click="selectEngine(engine)"
        >
          <ak-icon :size="25">
            <component :is="engine.component"></component>
          </ak-icon>
          <span>{{ engine.label }}</span>
        </div>
      </div>
    </transition>

    <!-- 下拉搜索记录列表 -->
    <transition>
      <div
        ref="historyDropdownRef"
        v-if="showSearchHistory && histories.length > 0"
        class="histories"
      >
        <div v-for="history in histories" :key="history.id" class="history-item">
          <span class="keyword" @click="handleSearch(history.keyword)">{{ history.keyword }}</span>
          <button class="delete" @click.stop="deleteHistory(history.id)">×</button>
        </div>
        <button class="clear" @click="clearHistory">清空历史记录</button>
      </div>
    </transition>

    <!-- 下拉搜索建议列表 -->
    <transition>
      <div ref="suggestDropdownRef" v-if="showSearchSuggest"></div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { markRaw, nextTick, ref, useTemplateRef, type Component } from "vue";
import { akIcon } from "@/components";
import { BingIcon, BaiduIcon } from "@/assets/icons";
import { useSearchHistoryStore } from "@/pinia/stores";
import { storeToRefs } from "pinia";

interface Engine {
  label: string;
  value: "google" | "bing" | "baidu";
  url: string;
  component: Component;
}

const searchHistoryStore = useSearchHistoryStore();
const { histories } = storeToRefs(searchHistoryStore);

const selectorRef = useTemplateRef("selectorRef");

const engineDropdownRef = useTemplateRef("engineDropdownRef");
const historyDropdownRef = useTemplateRef("historyDropdownRef");
const suggestDropdownRef = useTemplateRef("suggestDropdownRef");

const inputRef = useTemplateRef("inputRef");

// 已选择的搜索引擎
const selectedEngine = ref<Engine>({
  label: "必应",
  value: "bing",
  url: "https://www.bing.com/search?q=",
  component: BingIcon,
});

// 搜索引擎列表
const engines: Engine[] = [
  {
    label: "必应",
    value: "bing",
    component: markRaw(BingIcon),
    url: "https://www.bing.com/search?q=",
  },
  {
    label: "百度",
    value: "baidu",
    component: markRaw(BaiduIcon),
    url: "https://www.baidu.com/s?wd=",
  },
];

// 选择引擎中
const showSearchEngine = ref(false);
// 搜索记录中
const showSearchHistory = ref(false);
// 搜索结果中
const showSearchSuggest = ref(false);

// 搜索关键字
const keyword = ref("");

// 展开折叠引擎选择
const toggleChoosingEngine = () => {
  showSearchEngine.value = !showSearchEngine.value;
};
// 选择引擎
const selectEngine = (engine: Engine) => {
  selectedEngine.value = engine;
  showSearchEngine.value = false;
};

// 定义所有下拉框的配置
const dropdownConfigs = [
  {
    show: showSearchEngine, // 控制该下拉框显示的 ref
    dropdownRef: engineDropdownRef, // 下拉框容器的 ref
    triggerRef: selectorRef, // 触发该下拉框的元素的 ref（点击此元素时不关闭）
  },
  {
    show: showSearchHistory,
    dropdownRef: historyDropdownRef,
    triggerRef: inputRef,
  },
  {
    show: showSearchSuggest,
    dropdownRef: suggestDropdownRef,
    triggerRef: inputRef, // 搜索建议通常也由输入框触发
  },
];

// 关闭下拉框
const handleClick = (event: MouseEvent) => {
  const target = event.target as Node;
  for (const config of dropdownConfigs) {
    if (!config.show.value) continue;

    const isInsideDropdown = config.dropdownRef.value?.contains(target);
    const isInsideTrigger = config.triggerRef.value?.contains(target);

    // 如果点击位置既不在下拉框内也不在触发元素内，则关闭该下拉框
    if (!isInsideDropdown && !isInsideTrigger) config.show.value = false;
  }
};

// 清空历史记录
const clearHistory = () => {
  searchHistoryStore.clearHistory();
  showSearchHistory.value = false;
};

// 删除单条历史
const deleteHistory = (id: string) => {
  searchHistoryStore.deleteHistory(id);
  if (histories.value.length === 0) showSearchHistory.value = false;
};

// 清空输入
const clearInput = () => {
  keyword.value = "";

  nextTick(() => {
    inputRef.value?.focus();
  });
};

// 搜索
const handleSearch = (_keyword: string) => {
  if (!_keyword.trim()) return;
  const url = selectedEngine.value.url + encodeURIComponent(_keyword);
  window.open(url, "_blank");

  searchHistoryStore.addHistory(_keyword);
  keyword.value = _keyword;
};

document.addEventListener("click", handleClick);
</script>

<style scoped lang="less">
.search-container {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  position: relative;

  .search-box {
    width: 500px;
    height: 50px;
    display: flex;
    align-items: center;
    background: #ffffff;
    border-radius: 15px;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08) 0 2px 4px rgba(0, 0, 0, 0.02);
    transition:
      box-shadow 0.25s ease,
      transform 0.2s ease;
    overflow: hidden;
    border: 1px solid #dcdfe6;

    &:focus-within {
      // transform: translateY(-2px);
      box-shadow: 0 12px 28px rgba(0, 0, 0, 0.6);
      border: 1px solid #fff;
    }

    .engine-selector {
      position: relative;
      user-select: none;
      height: 100%;

      .selected {
        height: 100%;
        width: 70px;
        display: flex;
        align-items: center;
        justify-content: center;
        background: #f5f7fa;
        border: none;
        cursor: pointer;
        transition: backgroud 0.2s;

        &:hover {
          background: #ebedf0;
        }

        .arrow {
          font-size: 12px;
          color: #7c8b9e;
        }
      }
    }

    .input-wrapper {
      position: relative;
      flex: 1;

      .search-input {
        width: 100%;
        padding: 14px 16px;
        border: none;
        outline: none;
        font-size: 16px;
        background: transparent;
        color: #1e2f3e;
        font-family: inherit;

        &::placeholder {
          color: #b9c3d0;
          font-weight: 400;
        }
      }

      .clear-btn {
        position: absolute;
        right: 12px;
        top: 50%;
        transform: translateY(-50%);
        background: none;
        border: none;
        font-size: 20px;
        color: #aaa;
        cursor: pointer;
        padding: 0;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 20px;
        height: 20px;
        border-radius: 50%;
        transition:
          background 0.2s,
          color 0.2s;

        &:hover {
          color: #666;
          background: #f0f0f0;
        }
      }
    }
  }

  .engines {
    width: 500px;
    position: absolute;
    top: 100%;
    left: calc(50% - 250px);
    margin-top: 8px;
    background: #ffffffaa;
    backdrop-filter: blur(12px);
    border-radius: 15px;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    z-index: 10;
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    justify-content: flex-start;
    padding: 20px;

    .engine-item {
      display: flex;
      align-items: center;
      flex-direction: column;
      justify-content: center;
      font-size: 12px;
      padding: 10px 15px;
      border-radius: 20%;
      gap: 2px;
      cursor: pointer;
      transition: background 0.2s;
      background: #f5f7fa;

      &:hover {
        background: #ebedf0;
      }
    }
  }

  .histories {
    width: 500px;
    position: absolute;
    top: 100%;
    left: calc(50% - 250px);
    margin-top: 8px;
    background: #ffffffaa;
    backdrop-filter: blur(12px);
    border-radius: 15px;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    z-index: 10;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;

    .history-item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      padding: 10px 20px;
      border-radius: 15px;
      cursor: pointer;
      transition: background 0.2s;
      font-size: 16px;

      &:hover {
        background-color: #ffffffcc;
      }

      .keyword {
        flex: 1;
      }

      .delete {
        margin-left: auto;
        background: none;
        border: none;
        color: #9ca3af;
        cursor: pointer;
        font-size: 20px;
        transition: all 0.2s;
        display: flex;
        align-items: center;
        justify-content: center;
        width: 25px;
        height: 25px;

        &:hover {
          color: #f56c6c;
        }
      }
    }

    .clear {
      padding: 10px 20px;
      background: none;
      border: none;
      color: #3b82f6;
      cursor: pointer;
      font-size: 16px;
      border-radius: 15px;
      transition: background 0.2s;

      &:hover {
        background-color: #ffffffcc;
      }
    }
  }
}
</style>
