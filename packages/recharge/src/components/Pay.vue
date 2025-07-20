<template>
  <section class="payWrap">
    <p>信息1</p>
    <p>信息2</p>
    <p>信息3</p>
    <p>信息4</p>
  </section>
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

// 使用 useSc 和 useLyk
const { scTrack } = useSc();
const lyk = useLyk();
</script>

<style scoped lang="less">
.payWrap {
  width: 100%;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

p {
  width: 100%;
  height: 50px;
  padding: 10px;
  background-color: #f4f4f4;
  border-radius: 4px;
}
</style>
