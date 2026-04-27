import { createApp } from "vue";
import App from "./App.vue";
import "./style.css";
import router from "./router";
import "primeicons/primeicons.css";
import { startLoading, stopLoading } from "@/stores/loading";
const app = createApp(App);

app.use(router);
router.beforeEach(() => {
  startLoading("Loading view");
});

router.afterEach(to => {
  const defaultTitle = "Retro Reels";
  document.title = to.name? `${String(to.name)} - ${defaultTitle}` : defaultTitle;
  stopLoading();
})

router.onError(() => {
  stopLoading();
});

app.mount("#app");
