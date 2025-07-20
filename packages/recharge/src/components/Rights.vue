<template>
  <ul>
    <li v-for="(item, index) in status.rights" :key="item.key">
      {{ item.name }}
    </li>
  </ul>
</template>

<script setup lang="ts">
import { useSc } from "@/uiux/useSc";
import { useLyk } from "@/uiux/useLyk";
import { reactive } from "vue";

// 定义状态类型
interface StatusItem {
  key: number;
  name: string;
}

// 使用 reactive 初始化状态
const status = reactive({
  rights: [
    { key: 1, name: "权益1" },
    { key: 2, name: "权益2" },
    { key: 3, name: "权益3" },
    { key: 4, name: "权益4" },
    { key: 5, name: "权益5" },
    { key: 6, name: "权益6" },
    { key: 7, name: "权益7" },
    { key: 8, name: "权益8" },
  ] as StatusItem[],  // 显式声明类型
});

// 使用 useSc 和 useLyk
const { scTrack } = useSc();
const lyk = useLyk();
</script>

<style scoped lang="less">
ul {
  width: 100%;
  padding: 0;
  margin: 0;
  list-style: none;
  display: flex;
  flex-wrap: wrap;  /* 允许换行 */
  gap: 10px;
}

li {
  width: calc(25% - 10px); /* 每个li占50%的宽度，减去间距 */
  padding: 10px;
  background-color: #f4f4f4;
  border-radius: 4px;
  transition: background-color 0.3s ease;
}


</style>
