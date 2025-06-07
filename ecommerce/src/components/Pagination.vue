<template>
  <div class="mt-6 flex justify-center space-x-2">
    <button
      v-for="page in totalPages"
      :key="page"
      @click="emit('pageChange', page)"
      class="px-3 py-1 border rounded hover:bg-blue-100"
      :class="{ 'bg-blue-500 text-white': page === currentPage }"
    >
      {{ page }}
    </button>
  </div>
</template>

<script setup>
import { computed, ref, watch } from 'vue'

const props = defineProps({
  total: Number,
  limit: Number,
})
const emit = defineEmits(['pageChange'])

const currentPage = ref(1)

watch(currentPage, (newPage) => {
  emit('pageChange', newPage)
})

const totalPages = computed(() => {
  return Math.ceil(props.total / props.limit)
})
</script>