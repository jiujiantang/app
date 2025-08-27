<!-- 页面入口 -->
<template>
  <div class="appContainer">
    <Debug />
    <!-- 头部 -->
    <div class="header">
      <span class="user"></span>
      <span class="userName">森林艺术莫...（ID：123456789）</span>
      <span class="close" @click="handleClose"></span>
    </div> 
    <!-- 活动 -->
    <div class="app-content">
      <div class="wrap">
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
    </div>
    <!-- 尾部 -->
    <div class="footer">
      <template v-if="collectResults.length > 0">
        <ul>
          <li>Collected Parameters:</li>
          <li v-for="(result, index) in collectResults" :key="index">
            {{ result.params }}
          </li>
        </ul>
      </template>
    </div> 
  </div>
</template>

<script setup lang="ts">
import {onMounted, watchEffect, ref, handleError} from "vue"
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
import { useLyk } from "@/uiux/useLyk";

const login = useLogin()
const { scTrack } = useSc()
const {useUrl} = Common
const {getQueryVariable} = useUrl()

const componentName = "Init"
onMounted(() => {
  scTrack("Lyk12zhounianqingExposure", {})

  // 初始化： url导航?side=2&tab=2&coupon=1
  eventBus.publishCollect(componentName, {
    side: Number(getQueryVariable("side")) || 1,
    tab: Number(getQueryVariable("tab")) || 1,
    coupon: Number(getQueryVariable("coupon")) || 2,
  });

})

const lyk = useLyk();
const handleClose = ()=>{

}

// 监听 eventBus 中的收集结果
const collectResults = ref<any[]>([]);
watchEffect(() => {
  collectResults.value = eventBus.getCollectResults();  // 获取所有组件的收集结果
});

</script>

<style scoped lang="less">
  @content-width: 1360px;
  // @image-domain: "https://lykstatic.3d66.com/liuyunku/application/packages/recharge/public/image";
  @image-domain: "/public/image";

  @app-w: 1000px;
  @app-h: 620px;
  @app-content-w: 940px;
  @app-content-h: 494px;
  @app-sidebar-left-w: 160px;
  @app-sidebar-left-h: 100%;
  @app-sidebar-content-w: 554px;
  @app-sidebar-content-h: 100%;
  @app-sidebar-right-w: 225px;
  @app-sidebar-right-h: 100%;

  .appContainer {
    width: @app-w;
    height: @app-h;
    background: red;
    display: flex;
    flex-direction: column;
    text-align: center;
    position: relative;
    background: url("@{image-domain}/bg1.png") no-repeat;
    background-size: 1030px 650px;
    background-position: -14px -12px;
    border-radius: 20px;
  }
  // 活动
  .header {
    width: 100%;
    height: 80px;
    display: flex;
    align-items: center;
    padding: 0 30px;
    gap: 8px;
    position: relative;
    .user {
      display: inline-block;
      width: 30px;
      height: 30px;
      border-radius: 15px;
      background: #fff;
    }
    .userName {
      font-size: 14px;
      font-weight: 500;
      color: #FFFFFF;
    }
    .close {
      width: 40px;
      height: 37px;
      background: url(./assets/image/close.png) no-repeat center;
      font-size: 14px;
      font-weight: 500;
      color: #FFFFFF;
      position: absolute;
      right: 30px;
      cursor: pointer;
    }
  }
  .footer {
    width: 100%;
    height: 25px;
    color: #fff;
    position: absolute;
    bottom: 0;
    ul {
      list-style: none;
      li {
        float: left;
      }
    }
  }
  .app-content {
    width: @app-content-w;
    height: @app-content-h;
    position: relative;
    border-radius: 20px;
    background: rgba(255, 255, 255, 0.3);
    backdrop-filter: blur(10px);
    margin: 16px auto 0;
    padding-top: 44px;
    .wrap {
      width: 100%;
      height: 450px;
      display: flex;
      flex-direction: row;
      border-radius: 20px;
      background: #fff;
    }
    .sidebar-left {
      width: @app-sidebar-left-w;
      height: @app-sidebar-left-h;
      border-width: 0px 1px 0px 0px;
      border-style: solid;
      border-image: linear-gradient(0deg, #F7EBD7 0%, rgba(247, 235, 215, 0) 112%) 0 0 0 1;
    }
    .main-content {
      width: @app-sidebar-content-w;
      height: @app-sidebar-content-h;
      .tabBar {
        height: 60px;
        margin-top: -60px;
      }
      .couponBar {
        margin-top: 26px;
      }
      .rightsContent {
        margin-top: 32px;
      }
    }
    .sidebar-right {
      width: @app-sidebar-right-w;
      height: @app-sidebar-right-h;
    }
  }
</style>
