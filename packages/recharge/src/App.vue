<!-- 页面入口 -->
<template>
  <div class="appContainer" @click="checkLogin">
    <Debug />
    <!-- 头部 -->
    <div class="header"></div> 
    <!-- 活动 -->
    <div class="app-content">
      <div class="sidebar-left">
        <!-- 侧边栏 -->
        <Side />
      </div>
      <div class="main-content">
        <!-- tab栏 -->
        <aside class="tabBar">
          <Tab />
        </aside>
        <!-- 券包 -->
        <aside class="couponBar">
          <Coupon />
        </aside>
        <!-- 福利 -->
        <section class="rightsContent">
          <Rights />
        </section>
      </div>
      <div class="sidebar-right">
        <!-- 支付 -->
        <Pay />
      </div>
    </div>
    <!-- 尾部 -->
    <div class="footer">
      <template v-if="collectResults.length > 0">
        <h3>Collected Parameters:</h3>
        <ul>
          <li v-for="(result, index) in collectResults" :key="index">
            {{ result.params }}
          </li>
        </ul>
      </template>
    </div> 
  </div>
</template>

<script setup lang="ts">
import {onMounted, watchEffect, ref} from "vue"
import { useLogin } from "@/uiux/useLogin";
import Debug from '@/components/Debug.vue';
import {useSc} from "@/uiux/useSc";
import Common from 'common';
import Side from "./components/Side.vue";
import Tab from "./components/Tab.vue";
import Coupon from "./components/Coupon.vue";
import Rights from "./components/Rights.vue";
import Pay from "./components/Pay.vue";
import { eventBus } from "@/components/EventBus";

const login = useLogin()
const { scTrack } = useSc()
const {useUrl} = Common
const {getQueryVariable} = useUrl()

onMounted(() => {
  scTrack("Lyk12zhounianqingExposure", {})

  // a标签导航
  if(getQueryVariable("hook") === "position"){
    const targetSection = document.getElementById('position');
    targetSection && targetSection.scrollIntoView({ behavior: 'smooth' });
  }
})

// 监听 eventBus 中的收集结果
const collectResults = ref<any[]>([]);
watchEffect(() => {
  collectResults.value = eventBus.getCollectResults();  // 获取所有组件的收集结果
  if (collectResults.value.length > 0) {
    console.log('All parameters are collected, performing final processing...');
    // 执行联合查询或其他处理
  }
});

const checkLogin = () => {
  login.checkLogin()
}

</script>

<style scoped lang="less">
  @content-width: 1360px;
  // @image-domain: "https://lykstatic.3d66.com/liuyunku/application/packages/recharge/public/image";
  @image-domain: "/public/image";

  @app-w: 600px;
  @app-h: 600px;
  @app-content-w: 100%;
  @app-content-h: 600px;
  @app-sidebar-left-w: 100px;
  @app-sidebar-left-h: 100%;
  @app-sidebar-content-w: 400px;
  @app-sidebar-content-h: 100%;
  @app-sidebar-right-w: 100px;
  @app-sidebar-right-h: 100%;

  .appContainer {
    width: @app-w;
    height: @app-h;
    background: red;
    display: flex;
    flex-direction: column;
    text-align: center;
    position: relative;
  }
  .header {
    width: 100%;
    height: 50px;
  }
  .footer {
    width: 100%;
    height: 50px;
    position: absolute;
    bottom: 0;
    ul {
      list-style: none;
      li {
        float: left;
      }
    }
  }
  // 活动
  .app-content {
    width: @app-content-w;
    height: @app-content-h;
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: row;
    .sidebar-left {
      width: @app-sidebar-left-w;
      height: @app-sidebar-left-h;
    }
    .main-content {
      width: @app-sidebar-content-w;
      height: @app-sidebar-content-h;
    }
    .sidebar-right {
      width: @app-sidebar-right-w;
      height: @app-sidebar-right-h;
    }
  }
</style>
