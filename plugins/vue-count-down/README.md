解决单个、多个倒计时声明问题
```vue
<script setup lang="ts">
  import Countdown, {countdownManager} from 'vue-count-down'

  const endA = Date.now() + 10000;
  const endB = Date.now() + 20000;

  function pauseA() {
    countdownManager.getCore('groupA').pause();
  }
  function resumeA() {
    countdownManager.getCore('groupA').resume();
  }
  function pauseB() {
    countdownManager.getCore('groupB').pause();
  }
  function resumeB() {
    countdownManager.getCore('groupB').resume();
  }
  const handleFinish = (keyName: string) => {
    console.log(keyName);
  }
</script>
<template>
  <div>
    <Countdown keyName="groupA" :end="endA" :onFinish="handleFinish">
      <template #default="{ time }">
        <p>组A倒计时: {{ time }}</p>
      </template>
    </Countdown>
    <Countdown keyName="groupA" :end="endA" :onFinish="handleFinish">
      <template #default="{ time }">
        <p>组A另一个显示: {{ time }}</p>
      </template>
    </Countdown>

    <Countdown keyName="groupB" :end="endB" :onFinish="handleFinish">
      <template #default="{ time }">
        <p>组B倒计时: {{ time }}</p>
      </template>
    </Countdown>

    <button @click="pauseA">暂停组A</button>
    <button @click="resumeA">继续组A</button>
    <button @click="pauseB">暂停组B</button>
    <button @click="resumeB">继续组B</button>
  </div>
</template>

```