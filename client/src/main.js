import { createApp } from "vue";
import App from "./App.vue";
import "./style.css";
import router from "./router";
import PrimeVue from "primevue/config";
import Aura from "@primevue/themes/aura";
import "primeicons/primeicons.css";
import InputText from "primevue/inputtext";
import Dialog from "primevue/dialog";
import Button from "primevue/button";
import Menubar from "primevue/menubar";
import DataTable from "primevue/datatable";
import Column from "primevue/column";
import ColumnGroup from "primevue/columngroup"; // optional
import Row from "primevue/row"; // optional
const app = createApp(App);

app.use(router);
router.afterEach(to => {
  const defaultTitle = "Retro Reels";
  document.title = to.name? `${to.name} - ${defaultTitle}` : defaultTitle;
})
app.use(PrimeVue, {
  theme: {
    preset: Aura,
    Options: {
      darkModeSelector: false || "none",
      // cssLayer: {
      //   name: "primevue",
      //   // order: "tailwind-base, primevue, tailwind-utilities",
      // },
    },
  },
});
app.component("InputText", InputText); // Registering with the component name
app.component("Dialog", Dialog);
app.component("Button", Button);
app.component("Menubar", Menubar);
app.component("DataTable", DataTable);
app.component("Column", Column);
app.component("ColumnGroup", ColumnGroup);
app.component("Row", Row);
app.mount("#app");
