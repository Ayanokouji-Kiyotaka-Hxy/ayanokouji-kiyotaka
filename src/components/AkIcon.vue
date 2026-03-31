<template>
  <span class="icon-container" :style="{ fontSize: `${size}px`, color }">
    <slot></slot>
  </span>
</template>

<script setup lang="ts">
defineProps({
  size: {
    type: [String, Number],
    default: 20,
  },
  color: {
    type: String,
    default: "currentColor",
  },
});
</script>

<style scoped lang="less">
.icon-container {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  line-height: 1;
  vertical-align: middle;

  :deep(svg) {
    width: 1em;
    height: 1em;
    fill: currentColor;
    color: currentColor;
  }
}
</style>
