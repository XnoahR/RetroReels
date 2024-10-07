import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import PrimeVue from "primevue/config";
import Aura from "@primevue/themes/aura";
import 'primeicons/primeicons.css'
import InputText from "primevue/inputtext";
import Dialog from "primevue/dialog";
import Button from "primevue/button";
import Menubar from "primevue/menubar";
const app = createApp(App);

app.use(router);
app.use(PrimeVue, {
  theme: {
    preset: Aura,
    Options: {
      darkModeSelector: false || 'none'
    }
  },
});
app.component('InputText', InputText); // Registering with the component name
app.component('Dialog', Dialog);
app.component('Button', Button);
app.component('Menubar', Menubar)


app.mount("#app");
