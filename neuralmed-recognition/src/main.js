import { createApp, defineCustomElement } from "vue";
import App from "./App.vue";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";

// Criar o Web Component a partir do Vue
const RecognitionElement = defineCustomElement(App);
customElements.define("recognition-element", RecognitionElement);

// Se não houver um Web Component, monte o Vue normalmente
if (!document.body.querySelector("recognition-element")) {
  const app = createApp(App);
  app.use(ElementPlus);
  app.mount("#app"); // 🔹 Agora, se acessado diretamente, exibe a interface normalmente
}
