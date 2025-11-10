import { createApp } from 'vue'
import './index.css'
import App from './App.vue'
import { registerApplication, start } from 'single-spa';

registerApplication({
  name: 'square',
  app: () => import('../../square/src/toy-react.js'),
  activeWhen: '/square',
  customProps: {
    some: 'value',
  }
});
start()

async function loadScripts() {

}
loadScripts().then(r => {
  const app =  createApp(App)
  app.mount('#app')
}).catch(error => {
  console.error("Error loading scripts:", error);
});