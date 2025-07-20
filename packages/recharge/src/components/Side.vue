<template>
  <ul>
    <li v-for="(item, index) in status.side" :key="item.key" @click="handleClick(item.key)" :class="{active: item.key === status.value}">
      {{ item.name }}
    </li>
  </ul>
</template>

<script setup lang="ts">
import { useSc } from "@/uiux/useSc";
import { useLyk } from "@/uiux/useLyk";
import { onMounted, reactive } from "vue";
import { eventBus } from "@/components/EventBus";

// 定义状态类型
interface sideItem {
  key: number;
  name: string;
}

// 使用 reactive 初始化状态
const status = reactive({
  side: [
    { key: 1, name: "贵族1" },
    { key: 2, name: "贵族2" },
    { key: 3, name: "贵族3" },
    { key: 4, name: "贵族4" },
    { key: 5, name: "贵族5" },
    { key: 6, name: "贵族6" }
  ] as sideItem[],  // 显式声明类型
  value: 1 as number,
});

// 使用 useSc 和 useLyk
const { scTrack } = useSc();
const lyk = useLyk();

const componentName = 'Side';
const handleClick = (key: number) => {
  status.value = key;
  const params = { side: key };
  eventBus.publishCollect(componentName, params);  // 发布参数收集事件
}
onMounted(()=>{
  eventBus.subscribeCollect((component: string, params: any) => {
    if(component === "Init"){
      status.value = params.side;
      return { side: params.side };
    }else {
      return { side: status.value };
    }
  })
})
</script>

<style scoped lang="less">
ul {
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
  list-style: none; /* 去掉默认的列表样式 */
  padding-top: 50px;
}

li {
  padding: 10px;
  background-color: #f4f4f4;
  margin-bottom: 5px;
  border-radius: 4px;
  transition: background-color 0.3s ease;
  cursor: pointer;
  &.active{
    border: green 2px solid;
  }
}

li:hover {
  background-color: #e0e0e0;
}
</style>
