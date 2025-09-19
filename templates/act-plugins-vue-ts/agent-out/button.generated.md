```vue
<template>
  <button :disabled="disabled" class="button">
    {{ label }}
  </button>
</template>

<script setup lang="ts">
// Props interface
interface Props {
  /** 按钮的标签 */
  label: string;
  /** 按钮是否禁用 */
  disabled: boolean;
}

// Define props
const props = defineProps<Props>();
</script>

<style scoped>
.button {
  padding: 10px 20px;
  font-size: 16px;
  color: white;
  background-color: #007bff;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;
}

.button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

.button:not(:disabled):hover {
  background-color: #0056b3;
}
</style>
```