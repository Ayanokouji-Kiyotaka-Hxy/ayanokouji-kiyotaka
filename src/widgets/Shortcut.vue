<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <div class="shortcut-container widget-container" @click="handleClick">
    <div class="shortcut-icon">
      <img :src="widget?.icon" :alt="`${widget?.name}图标`" />
    </div>
    <span class="shortcut-name">{{ widget?.name }}</span>
  </div>
</template>

<script setup lang="ts">
import type { ShortcutWidget } from "@/pinia/stores";
import type { PropType } from "vue";

const props = defineProps({
  widget: { type: Object as PropType<ShortcutWidget>, require: true },
});

const handleClick = () => {
  window.open(props.widget?.url, "_blank");
};
</script>

<style lang="less" scoped>
.shortcut-container.widget-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  border-radius: 20px;
  transition: all 0.25s ease;
  cursor: pointer;
  padding: 12px 8px;
  box-sizing: border-box;

  .shortcut-icon {
    width: 64px;
    height: 64px;
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    justify-content: center;

    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      border-radius: 10px;
    }
  }

  .shortcut-name {
    font-size: 18px;
    text-align: center;
    word-break: break-word;
    max-width: 100%;
    line-height: 1.3;
    font-weight: bold;
    color: #ffffff;
    text-shadow: 0 1px 2px rgba(0, 0, 0, 0.6);
  }
}
</style>
