import { createPinia } from "pinia";
import { boot } from "quasar/wrappers";


export default boot(async ({ app }) => {
    const pinia = createPinia();
    app.use(pinia);
    console.log({ pinia })
})