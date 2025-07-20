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
    { key: 1, name: "素材下载满1币" },
    { key: 2, name: "VIP库素材免费下" },
    { key: 3, name: "付费素材重复下载" },
    { key: 4, name: "付费免费下载折扣" },
    { key: 5, name: "付费免费下载折扣" },
    { key: 6, name: "材质免费下载" },
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
  width: calc(33% - 10px); /* 每个li占50%的宽度，减去间距 */
  height: 44px;
  line-height: 44px;
  border-radius: 4px;

  font-size: 14px;
  font-weight: 500;
  color: #4D4D4D;
  background: #EBE6D7;
}


</style>
