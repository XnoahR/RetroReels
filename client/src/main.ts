import { createApp } from "vue";
import App from "./App.vue";
import "./style.css";
import router from "./router";
import "primeicons/primeicons.css";
const app = createApp(App);

app.use(router);
router.afterEach(to => {
  const defaultTitle = "Retro Reels";
  document.title = to.name? `${String(to.name)} - ${defaultTitle}` : defaultTitle;
})

app.mount("#app");
