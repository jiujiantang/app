<script setup lang="ts">
import Button from '../src'

const handleClick = (): void => {
  alert(1)
}
</script>
<template>
  <Button label="点我" :onClick="handleClick" />
</template>
