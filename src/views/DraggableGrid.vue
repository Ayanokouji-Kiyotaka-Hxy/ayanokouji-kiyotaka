<template>
  <div class="draggable-container">
    <div ref="gridRef" class="grid-stack"></div>
  </div>
</template>

<script setup lang="ts">
import { useDashBoardStore, type Widget } from "@/pinia/stores";
import { getWidgetComponent, type SetStaticFn } from "@/widgets";
import { GridStack } from "gridstack";
import { storeToRefs } from "pinia";
import { createApp, nextTick, onMounted, useTemplateRef, watch, type App } from "vue";
import "gridstack/dist/gridstack.min.css";

const dashboardStore = useDashBoardStore();
const { widgets } = storeToRefs(dashboardStore);

// grid 实例
let grid: GridStack | null = null;
// grid dom实例
const gridRef = useTemplateRef("gridRef");

// 已挂载组件实例
const mountedApps = new Map<string, { app: App<Element>; el: HTMLElement }>();

// 挂载单个 widget
const mountWidget = (widget: Widget) => {
  if (!grid) return console.warn("Grid not initialized yet");

  // 1.获取对应的 Vue 组件
  const component = getWidgetComponent(widget.type);

  // 2.创建 DOM 容器
  const el = document.createElement("div");
  const app = createApp(component, { widget, setStatic: setStaticHandler });
  app.mount(el);

  // 3.保存已挂载组件实例
  mountedApps.set(widget.id, { app, el });

  // 4.将组件添加到网格中
  grid!.makeWidget(el, { ...widget });
};

// 初始化所有 widgets
const initGrid = () => {
  if (!gridRef.value) return;
  grid = GridStack.init(
    {
      float: false,
      column: 15,
      row: 6,
      margin: 20,
      acceptWidgets: true,
      disableResize: true,
      animate: true,
    },
    gridRef.value,
  );

  widgets.value.forEach((widget) => mountWidget(widget));

  const syncLayout = () => {
    const items = grid?.getGridItems();
    if (!items) return;

    items.forEach((el) => {
      const id = el.getAttribute("gs-id") || "";
      const widget = widgets.value.find((w) => w.id === id);
      if (widget) {
        widget.x = parseInt(el.getAttribute("gs-x") || "0");
        widget.y = parseInt(el.getAttribute("gs-y") || "0");
        widget.w = parseInt(el.getAttribute("gs-w") || "1");
        widget.h = parseInt(el.getAttribute("gs-h") || "1");
      }
    });

    grid?.compact();
  };

  grid.on("change", syncLayout);

  if (widgets.value.findIndex((widget) => widget.id === "append") === -1) {
    widgets.value.push({
      id: "append",
      type: "append",
      x: undefined,
      y: undefined,
      w: 1,
      h: 1,
      locked: false,
      noMove: true,
    });
  }

  nextTick(() => {
    syncLayout();
  });
};

//
const setStaticHandler: SetStaticFn = (mask: boolean) => {
  grid?.setStatic(mask);
};

onMounted(() => {
  initGrid();
});

watch(
  () => widgets.value,
  (newWidgets) => {
    console.log(newWidgets);

    newWidgets.forEach((widget) => {
      if (!mountedApps.has(widget.id)) mountWidget(widget);
    });
  },
  { deep: true },
);
</script>

<style lang="less" scoped>
.draggable-container {
  width: 100%;
  height: 100%;
}
</style>
