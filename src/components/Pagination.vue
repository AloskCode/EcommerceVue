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
import { computed, ref, watch } from 'vue' // Importa as funções reativas do Vue

// Define as propriedades que este componente pode receber
const props = defineProps({
  total: Number, // Número total de itens (ex: total de produtos)
  limit: Number, // Número máximo de itens por página
})

// Define os eventos que este componente pode emitir
const emit = defineEmits(['pageChange']) // Emite um evento 'pageChange' quando a página muda

// Estado reativo para controlar a página atualmente selecionada, inicia em 1
const currentPage = ref(1)

// Observa mudanças na `currentPage` e emite o evento `pageChange`
// Isso garante que o componente pai seja notificado sobre a mudança da página
watch(currentPage, (newPage) => {
  emit('pageChange', newPage)
})

// Propriedade computada que calcula o número total de páginas
// Baseia-se no número total de itens e no limite de itens por página
const totalPages = computed(() => {
  return Math.ceil(props.total / props.limit) // Arredonda para cima para garantir que todos os itens sejam exibidos
})
</script>