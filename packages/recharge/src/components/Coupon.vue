<template>
  <ul>
    <li v-for="(item, index) in status.coupon" :key="item.key" @click="handleClick(item.key)" :class="{active: item.key === status.value}">
      {{ item.name }}
    </li>
  </ul>
</template>

<script setup lang="ts">
import { useSc } from "@/uiux/useSc";
import { useLyk } from "@/uiux/useLyk";
import { reactive, onMounted } from "vue";
import { eventBus } from "@/components/EventBus";

// 定义状态类型
interface StatusItem {
  key: number;
  name: string;
}

// 使用 reactive 初始化状态
const status = reactive({
  coupon: [
    { key: 1, name: "199" },
    { key: 2, name: "398" },
    { key: 3, name: "597" },
  ] as StatusItem[],  // 显式声明类型
  value: 1 as number
});

// 使用 useSc 和 useLyk
const { scTrack } = useSc();
const lyk = useLyk();

const componentName = 'Coupon';
const handleClick = (key: number) => {
  status.value = key;
  const params = { coupon: key };
  eventBus.publishCollect(componentName, params);  // 发布参数收集事件
}
onMounted(()=>{
  eventBus.subscribeCollect((component: string, params: any) => {
    if(component === "Init"){
      status.value = params.coupon;
      return { coupon: params.coupon };
    }else if(component === "Side" || component === "Tab"){
      status.value = 2
    }
    return { coupon: status.value };
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
  justify-content: center;
  gap: 10px;
}

li {
  background-color: #f4f4f4;
  margin-bottom: 5px;
  border-radius: 4px;
  transition: background-color 0.3s ease;
  cursor: pointer;

  width: 180px;
  height: 180px;
  border-radius: 12px;
  background: linear-gradient(359deg, #FFE7BF -46%, #FFF4E2 97%);
  border: 2px solid #FFAD58;
  font-size: 30px;
  font-weight: bold;
  line-height: 180px;
  color: #4D4D4D;

  &.active{
    border: green 2px solid;
  }
}

li:hover {
  background-color: #e0e0e0;
}
</style>
