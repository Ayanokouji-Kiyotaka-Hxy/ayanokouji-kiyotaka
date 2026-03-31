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
      <div class="input-wrapper">
        <!-- 输入框 -->
        <input
          ref="inputRef"
          type="text"
          v-model="keyWords"
          placeholder="输入搜索内容"
          class="search-input"
          @keyup.enter="handleSearch"
        />
        <!-- 清空按钮 -->
        <button
          v-if="keyWords.length > 0"
          class="clear-btn"
          @click="clearInput"
          aria-label="清空输入"
        >
          ×
        </button>
      </div>
    </div>

    <!-- 下拉列表 -->
    <transition>
      <div ref="engineDropdownRef" v-if="choosingEngine" class="dropdown">
        <div
          v-for="engine in engines"
          :key="engine.value"
          class="dropdown-item"
          @click="selectEngine(engine)"
        >
          <ak-icon :size="25">
            <component :is="engine.component"></component>
          </ak-icon>
          <span>{{ engine.label }}</span>
        </div>
      </div>
    </transition>

    <transition>
      <div ref="searchDropdownRef" v-if="searchingResult"></div>
    </transition>
  </div>
</template>

<script setup lang="ts">
import { markRaw, nextTick, ref, useTemplateRef, type Component } from "vue";
import { akIcon } from "@/components";
import { BingIcon, BaiduIcon } from "@/assets/icons";

interface Engine {
  label: string;
  value: "google" | "bing" | "baidu";
  url: string;
  component: Component;
}

const selectorRef = useTemplateRef("selectorRef");
const engineDropdownRef = useTemplateRef("engineDropdownRef");
const searchDropdownRef = useTemplateRef("searchDropdownRef");

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
const choosingEngine = ref(false);
// 搜索结果中
const searchingResult = ref(false);

const keyWords = ref("");

// 展开折叠引擎选择
const toggleChoosingEngine = () => {
  choosingEngine.value = !choosingEngine.value;
};
// 选择引擎
const selectEngine = (engine: Engine) => {
  selectedEngine.value = engine;
  choosingEngine.value = false;
};
// 关闭下拉框
const handleClick = (event: MouseEvent) => {
  if (
    !engineDropdownRef.value?.contains(event.target as Node) &&
    !selectorRef.value?.contains(event.target as Node)
  )
    choosingEngine.value = false;

  if (!searchDropdownRef.value?.contains(event.target as Node)) searchingResult.value = false;
};

// 清空输入
const clearInput = () => {
  keyWords.value = "";

  nextTick(() => {
    inputRef.value?.focus();
  });
};

// 搜索
const handleSearch = () => {
  if (!keyWords.value.trim()) return;
  const url = selectedEngine.value.url + encodeURIComponent(keyWords.value);
  window.open(url, "_blank");
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
      transform: translateY(-2px);
      box-shadow: 0 12px 28px rgba(0, 0, 0, 0.12);
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

  .dropdown {
    width: 500px;
    position: absolute;
    top: 100%;
    left: calc(50% - 250px);
    margin-top: 8px;
    background: #ffffff;
    border-radius: 15px;
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
    overflow: hidden;
    z-index: 10;
    display: flex;
    flex-wrap: wrap;
    gap: 20px;
    justify-content: flex-start;
    padding: 20px;

    .dropdown-item {
      display: flex;
      align-items: center;
      flex-direction: column;
      justify-content: center;
      font-size: 10px;
      padding: 10px;
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
}
</style>
