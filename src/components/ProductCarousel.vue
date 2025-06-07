<template>
  <div class="relative max-w-7xl mx-auto py-6">
    <h2 class="text-xl font-semibold mb-4 px-4">Em Destaque</h2>

    <div class="flex items-center">
      <button @click="prevSlide" class="z-10 px-3 text-xl">
        ‹
      </button>

      <div class="overflow-hidden w-full">
        <div
          class="flex transition-transform duration-500 ease-in-out"
          :style="{ transform: `translateX(-${currentIndex * 100 / currentItemsPerPage}%` }"
        >
          <div
            v-for="product in products"
            :key="product.id"
            class="px-2 shrink-0"
            :class="slideItemWidthClass" 
          >
            <router-link :to="`/product/${product.id}`">
              <div class="bg-white shadow rounded p-4 flex flex-col">
                <img
                  :src="product.thumbnail"
                  :alt="product.title"
                  class="w-full h-40 object-cover rounded"
                />
                <h3 class="mt-2 text-sm font-medium text-gray-800">
                  {{ product.title }}
                </h3>
                <p class="text-blue-600 font-semibold mt-1">
                  R$ {{ product.price }}
                </p>
              </div>
            </router-link>
          </div>
        </div>
      </div>

      <button @click="nextSlide" class="z-10 px-3 text-xl">
        ›
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, onBeforeUnmount } from 'vue';
import axios from 'axios';

const products = ref([]); 
const currentIndex = ref(0); 
const windowWidth = ref(window.innerWidth); // Reativo à largura da janela

// Atualiza a largura da janela quando ela é redimensionada
const handleResize = () => {
  windowWidth.value = window.innerWidth;
};

// Hook para adicionar e remover o listener de redimensionamento
onMounted(() => {
  window.addEventListener('resize', handleResize);
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', handleResize);
});

// Propriedade computada para determinar quantos itens devem ser exibidos por página
const currentItemsPerPage = computed(() => {
  if (windowWidth.value >= 1024) { // lg breakpoint
    return 4;
  } else if (windowWidth.value >= 768) { // md breakpoint
    return 3;
  } else if (windowWidth.value >= 640) { // sm breakpoint
    return 2;
  } else { // default (xs)
    return 1;
  }
});

// Propriedade computada para aplicar a classe de largura correta do Tailwind
const slideItemWidthClass = computed(() => {
  if (windowWidth.value >= 1024) {
    return 'w-1/4';
  } else if (windowWidth.value >= 768) {
    return 'w-1/3'; // Para 3 itens por linha
  } else if (windowWidth.value >= 640) {
    return 'w-1/2'; // Para 2 itens por linha
  } else {
    return 'w-full'; // Para 1 item por linha
  }
});

// Propriedade computada para o número total de slides
const totalSlides = computed(() => {
  return Math.max(Math.ceil(products.value.length / currentItemsPerPage.value), 1);
});

const fetchProducts = async () => {
  try {
    const res = await axios.get('https://dummyjson.com/products?limit=40'); 
    products.value = res.data.products; 
  } catch (error) {
    console.error("Erro ao buscar produtos:", error); 
  }
};

const nextSlide = () => {
  if (currentIndex.value < totalSlides.value - 1) {
    currentIndex.value++; 
  } else {
    currentIndex.value = 0; // Volta para o primeiro slide
  }
};

const prevSlide = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--; 
  } else {
    currentIndex.value = totalSlides.value - 1; // Vai para o último slide
  }
};

onMounted(() => {
  fetchProducts();
  // Garante que o currentIndex esteja dentro dos limites ao redimensionar
  // Isso pode ser importante se o usuário redimensionar de uma tela grande para pequena
  currentIndex.value = Math.min(currentIndex.value, totalSlides.value - 1);
});
</script>

<style scoped>
/* Removemos o CSS fixo aqui, pois as classes Tailwind serão aplicadas dinamicamente. */
/* O shrink-0 já garante que os itens não encolham. */
</style>