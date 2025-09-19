import { createApp, h } from 'vue'
import './index.css'
import App from './App.vue'
import singleSpaVue from 'single-spa-vue';

// 普通的独立运行模式
if (!window.singleSpaNavigate) {
  createApp(App)
    // .use(router)
    .mount('#app');
}

// 微前端运行模式
const vueLifecycles = singleSpaVue({
  createApp,
  appOptions: {
    render() {
      return h(App, {});
    },
  },
  handleInstance(app) {
    // app.use(router);
  }
});

export const bootstrap = vueLifecycles.bootstrap;
export const mount = vueLifecycles.mount;
export const unmount = vueLifecycles.unmount;
