<template>
  <ul>
    <li v-for="(item, index) in status.tab" :key="item.key" @click="handleClick(item.key)" :class="{active: item.key === status.value}">
      {{ item.name }}
    </li>
  </ul>
</template>

<script setup lang="ts">
import { useSc } from "@/uiux/useSc";
import { useLyk } from "@/uiux/useLyk";
import { reactive,onMounted } from "vue";
import { eventBus } from "@/components/EventBus";

// 定义状态类型
interface StatusItem {
  key: number;
  name: string;
}

// 使用 reactive 初始化状态
const status = reactive({
  tab: [
    { key: 1, name: "基础会员" },
    { key: 2, name: "超级会员" },
  ] as StatusItem[],  // 显式声明类型
  value: 1 as number
});

// 使用 useSc 和 useLyk
const { scTrack } = useSc();
const lyk = useLyk();

const componentName = 'Tab';
const handleClick = (key: number) => {
  status.value = key;
  const params = { tab: key };
  eventBus.publishCollect(componentName, params);  // 发布参数收集事件
}
onMounted(()=>{
  eventBus.subscribeCollect((component: string, params: any) => {
    if(component === "Init"){
      status.value = params.tab;
      return { tab: params.tab };
    }else if(component === "Side"){
      status.value = 1
    }
    return { tab: status.value };
  })
})
</script>

<style scoped lang="less">
ul {
  width: 100%;
  height: 100%;
  padding: 0;
  margin: 0;
  list-style: none;
  display: flex;
  justify-content: left;
}

li {
  width: 335px;
  height: 60px;
  line-height: 60px;
  border-radius: 4px;
  transition: background-color 0.3s ease;
  cursor: pointer;
  font-size: 24px;
  color: #4D4D4D;
  background:#e0e0e0;
  &.active{
    background: #fff;
    border: green 2px solid;
  }
}

li:hover {
  background-color: #fff;
}
</style>
