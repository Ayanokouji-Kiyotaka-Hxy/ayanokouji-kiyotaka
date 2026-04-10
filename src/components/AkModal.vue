<template>
  <transition name="modal-fade-up">
    <div v-if="modelValue" class="modal-mask" @click="handleMaskClose">
      <div class="modal-container" :style="containerStyle" @click.stop>
        <div v-if="$slots.header" class="modal-header">
          <slot name="header" />
        </div>
        <div class="modal-body">
          <slot />
        </div>
        <div v-if="$slots.footer" class="modal-footer">
          <slot name="footer" />
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { computed } from "vue";

const props = defineProps({
  modelValue: { type: Boolean, required: true, default: false },
  cloneOnMask: { type: Boolean, required: false, default: true },
  width: { type: Number, required: false, default: 800 },
  height: { type: Number, required: false, default: 600 },
});

const containerStyle = computed(() => {
  const style: Record<string, string> = {};

  if (props.width) style.width = `${props.width}px`;
  if (props.height) style.height = `${props.height}px`;

  return style;
});

const emit = defineEmits<{
  (e: "update:modelValue", value: boolean): void;
  (e: "close"): void;
}>();

const close = () => {
  emit("update:modelValue", false);
  emit("close");
};

const handleMaskClose = () => {
  if (props.cloneOnMask !== false) close();
};
</script>

<style lang="less" scoped>
.modal-mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #0002;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;

  .modal-container {
    position: relative;
    background: #f0f2f5;
    border-radius: 24px;
    box-shadow:
      0 25px 50px -12px rgba(0, 0, 0, 0.25),
      0 0 0 1px rgba(0, 0, 0, 0.05);
    overflow-y: auto;
    transition: transform 0.3s ease;
    display: flex;
    flex-direction: column;

    .modal-header {
      padding: 20px 24px 0 24px;
      font-size: 1.25rem;
      font-weight: bolder;
      border-bottom: 1px solid #dcdfe6;
    }

    .modal-body {
      padding: 24px;
      flex: 1;
    }

    .modal-footer {
      padding: 0 24px 20px 24px;
      display: flex;
      justify-content: flex-end;
      gap: 12px;
      border-top: 1px solid #dcdfe6;
    }
  }
}

/* 过渡动画：上浮 + 淡入 */
.modal-fade-up-enter-active,
.modal-fade-up-leave-active {
  transition: opacity 0.3s ease;
}
.modal-fade-up-enter-active .modal-container,
.modal-fade-up-leave-active .modal-container {
  transition:
    transform 0.3s ease,
    opacity 0.3s ease;
}
.modal-fade-up-enter-from,
.modal-fade-up-leave-to {
  opacity: 0;
}
.modal-fade-up-enter-from .modal-container,
.modal-fade-up-leave-to .modal-container {
  transform: translateY(20px);
}
</style>
