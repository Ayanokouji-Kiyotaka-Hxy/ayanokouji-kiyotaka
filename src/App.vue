<template>
  <div class="app-container">
    <header class="header">
      <search-box />
    </header>
    <div class="container">
      <aside class="aside">aside</aside>
      <main class="main">
        <DraggableGrid />
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { DraggableGrid, SearchBox } from "@/views";
</script>

<style scoped lang="less">
.app-container {
  display: grid;
  grid-template-rows: auto 1fr;
  height: 100%;

  .header {
    padding: 100px 0;
  }

  .container {
    display: grid;
    grid-template-columns: 200px 1fr;
    overflow: auto;

    .aside {
      overflow-y: auto;
      padding: 20px;
    }

    .main {
      overflow-y: auto;
      padding: 20px;
    }
  }
}
</style>
