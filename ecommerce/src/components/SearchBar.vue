<template>
  <div class="mb-4">
    <input
      v-model="search"
      @input="onInput"
      type="text"
      placeholder="Buscar produtos..."
      class="w-full px-4 py-2 border rounded-md shadow-sm focus:outline-none focus:ring focus:border-blue-300"
    />
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
const emit = defineEmits(['search'])

const search = ref('')

let timeout
const onInput = () => {
  clearTimeout(timeout)
  timeout = setTimeout(() => {
    emit('search', search.value)
  }, 400)
}
</script>