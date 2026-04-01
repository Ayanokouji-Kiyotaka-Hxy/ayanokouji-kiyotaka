import "@/styles/main.less";

import { createApp } from "vue";
import App from "@/App.vue";

import pinia from "@/pinia";
import router from "@/router";

const app = createApp(App);

app.use(pinia);
app.use(router);

app.mount("#app");

const bgUrl = `https://bing.img.run/rand.php?t=${Date.now()}`;
document.body.style.backgroundImage = `url(${bgUrl})`;
