import { reactive } from 'vue';

export const eventBus = reactive({
  collectResults: [] as { component: string; params: any }[], // 存储所有收集的参数
  callbacks: [] as ((component: string, params: any) => any)[],  // 存储所有订阅的回调函数

  // 发布参数收集事件
  publishCollect(component: string, params: any) {
    console.log(`${component} triggered parameter collection with params:`, params);

    // 清除旧的收集结果
    this.clearOldCollectResults();

    // 执行所有订阅的回调函数，并收集参数
    this.callbacks.forEach(callback => {
      const collectedParams = callback(component, params);  // 调用每个组件的回调
      this.collectResults.push({ component, params: collectedParams });
    });

    // 触发结束事件
    this.triggerCollectEndEvent();
  },

  // 订阅收集事件，注册回调函数
  subscribeCollect(callback: (component: string, params: any) => any) {
    this.callbacks.push(callback);  // 注册回调
  },

  // 清空旧的收集结果
  clearOldCollectResults() {
    console.log('Clearing old parameter collect events and results');
    this.collectResults = [];
  },

  // 触发所有收集完成后的结束事件
  triggerCollectEndEvent() {
    console.log('All parameter collections are complete. Triggering end event.');
  },

  // 获取所有收集的结果
  getCollectResults() {
    return this.collectResults;
  }
});
