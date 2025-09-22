<!-- Button.vue -->
<template>
  <button :disabled="disabled" @click="handleClick" class="button">
    {{ label }}
  </button>
</template>

<script setup lang="ts">
import { defineProps } from 'vue';

const props = defineProps<{
  label: string;
  disabled?: boolean;
  onClick?: () => void;
}>();

const handleClick = () => {
  if (props.onClick && !props.disabled) {
    props.onClick();
  }
};
</script>

<style scoped>
.button {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  background-color: #007bff;
  color: white;
  cursor: pointer;
  font-size: 16px;
}

.button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}
</style>