<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="append-container widget-container" @click="handleClick">
    <ak-icon :size="100"><append-icon /></ak-icon>
  </div>

  <ak-modal v-model="show" @close="handleCLose">
    <form @submit.prevent="handleSubmit">
      <!-- 预览 -->
      <div class="preview">
        <component :is="getWidgetComponent('shortcut')" :widget="tempWidget"></component>
      </div>
      <!-- 表单 -->
      <div class="form">
        <div class="form-row">
          <label>网址</label>
          <input type="url" v-model="url" placeholder="https://example.com" required />
          <div v-if="!isValidUrl && url" class="error">请输入有效的URL</div>
        </div>
        <div class="form-row">
          <label>名称</label>
          <input type="text" v-model="name" placeholder="自动从网址获取" />
        </div>
        <div class="actions">
          <button type="submit" :disabled="!isValidUrl">确认</button>
        </div>
      </div>
    </form>
  </ak-modal>
</template>

<script setup lang="ts">
import { akIcon, AkModal } from "@/components";
import { AppendIcon } from "@/assets/icons";
import { computed, ref, watch, type PropType } from "vue";
import { getWidgetComponent, type SetStaticFn } from ".";
import { useDashBoardStore, type AppendWidget, type ShortcutWidget } from "@/pinia/stores";
import { storeToRefs } from "pinia";
import { v1 } from "uuid";

const props = defineProps({
  widget: { type: Object as PropType<AppendWidget>, required: true },
  setStatic: { type: Function as PropType<SetStaticFn>, required: true },
});

const dashboardStore = useDashBoardStore();
const { widgets } = storeToRefs(dashboardStore);

const show = ref(false);

const handleClick = () => {
  show.value = true;
  props.setStatic(show.value);
};

const handleCLose = () => {
  show.value = false;
  props.setStatic(show.value);
};

//#region 添加快捷方式
const url = ref(""); // 网址
const name = ref(""); // 名字
const icon = ref(""); // 图标
const tempWidget = computed<ShortcutWidget>(() => ({
  type: "shortcut",
  id: "temp",
  name: name.value,
  url: url.value,
  icon: icon.value,
  x: 0,
  y: 0,
  w: 1,
  h: 1,
}));

// 验证url合法性
const isValidUrl = computed(() => {
  try {
    new URL(url.value);
    return true;
  } catch {
    return false;
  }
});

// 域名提取
const extractDomain = (urlString: string) => {
  try {
    const { hostname } = new URL(urlString);
    return hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
};

// 获取 icon
const updateIcon = (domain: string) => {
  if (!domain) {
    icon.value = "";
    return;
  }
  icon.value = `https://www.favicon.org.cn/get.php?url=${domain}&size=128&key=USR-34B1CE30EFE41274B33D720D64F82519FEF452C5`;
};

watch(url, (newUrl) => {
  if (isValidUrl.value) {
    const domain = extractDomain(newUrl);
    name.value = domain;
    updateIcon(domain);
  } else if (!isValidUrl.value) icon.value = "";
});

const addShortcut = () => {
  widgets.value.push({
    id: v1(),
    type: "shortcut",
    name: name.value,
    url: url.value,
    icon: icon.value,
    w: 1,
    h: 1,
    x: props.widget?.x,
    y: props.widget?.y,
  });
};

const handleSubmit = () => {
  addShortcut();
  handleCLose();
};

//#endregion
</script>

<style lang="less" scoped>
// .append-container.widget-container {
// }

form {
  width: 100%;
  height: 100%;
  display: flex;
  gap: 50px;

  .preview {
    flex: 1;
    height: 100%;
    background: #e6e8eb;
  }

  .form {
    flex: 1;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    gap: 20px;

    .form-row {
      display: flex;
      flex-direction: column;
      gap: 8px;

      label {
        font-size: 20px;
        font-weight: bolder;
        color: #303133;
        letter-spacing: 0.3px;
      }

      input {
        padding: 12px 16px;
        border: 1px solid #dcdfe6;
        border-radius: 16px;
        font-size: 18px;
        background-color: #fff;
        transition: all 0.2s ease;
        outline: none;
        color: #606266;

        &:focus {
          border-color: #cdd0d6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }

        &::placeholder {
          color: #a8abb2;
        }
      }

      .error {
        font-size: 14px;
        color: #f56c6c;
        margin-top: 4px;
      }
    }

    .actions {
      display: flex;
      justify-content: center;
      gap: 12px;
      margin-top: 16px;

      button {
        padding: 10px 20px;
        width: 100px;
        border-radius: 40px;
        font-size: 20px;
        font-weight: bolder;
        cursor: pointer;
        transition: all 0.2s ease;
        border: none;
        background-color: #409eff;
        color: #fff;

        &:hover {
          background: #337ecc;
        }

        &:disabled {
          background: #c6e2ff;
          color: #c0c4cc;
          cursor: not-allowed;
          transform: none;
        }
      }
    }
  }
}
</style>
