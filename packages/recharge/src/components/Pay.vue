<template>
  <section class="payWrap">
    <p>198</p>
    <p>选择优惠券</p>
    <p>支付方式</p>
    <img :src="ma" alt="">
  </section>
</template>

<script setup lang="ts">
import { useSc } from "@/uiux/useSc";
import { useLyk } from "@/uiux/useLyk";
import { reactive } from "vue";
import ma from "@/assets/image/demoMa.png"

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
  &:first-child {
    height: 100px;
    font-size: 48px;
    font-weight: bold;
    line-height: 100px;
    color: #FF7F07;
  }
}
</style>
