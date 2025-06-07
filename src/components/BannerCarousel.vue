<template>
  <div class="banner-carousel relative overflow-hidden rounded-md shadow-md">
    <div class="carousel-wrapper flex transition-transform duration-500 ease-in-out" :style="{ transform: `translateX(-${currentIndex * 100}%)` }">
      <div v-for="(image, index) in images" :key="index" class="carousel-slide w-full flex-shrink-0">
        <img :src="image" :alt="`Banner ${index + 1}`" class="w-full h-full object-cover block"> </div>
    </div>

    <button @click="prevSlide" class="absolute top-1/2 left-4 transform -translate-y-1/2 bg-gray-300 bg-opacity-50 hover:bg-opacity-70 text-gray-800 font-bold py-2 px-3 rounded-full z-10">
      ‹
    </button>
    <button @click="nextSlide" class="absolute top-1/2 right-4 transform -translate-y-1/2 bg-gray-300 bg-opacity-50 hover:bg-opacity-70 text-gray-800 font-bold py-2 px-3 rounded-full z-10">
      ›
    </button>

    <div class="absolute bottom-4 left-0 w-full flex justify-center items-center space-x-2">
      <button
        v-for="(dot, index) in images.length"
        :key="dot"
        @click="goToSlide(index)"
        :class="{ 'bg-indigo-500': currentIndex === index, 'bg-gray-300': currentIndex !== index }"
        class="w-3 h-3 rounded-full cursor-pointer focus:outline-none"
      ></button>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const images = ref([
  new URL('../assets/imagens/banner1.png', import.meta.url).href, // Caminho corrigido
  new URL('../assets/imagens/banner02.png', import.meta.url).href, // Caminho corrigido
  new URL('../assets/imagens/banner03.png', import.meta.url).href, // Caminho corrigido
  new URL('../assets/imagens/banner04.png', import.meta.url).href  // Caminho corrigido
]);

const currentIndex = ref(0);
const totalSlides = images.value.length;

const nextSlide = () => {
  currentIndex.value = (currentIndex.value + 1) % totalSlides;
};

const prevSlide = () => {
  currentIndex.value = (currentIndex.value - 1 + totalSlides) % totalSlides;
};

const goToSlide = (index) => {
  currentIndex.value = index;
};
</script>

<style scoped>
.banner-carousel {
  /* Tamanho total do carrossel */
  max-width: 70%; /* Ocupa a largura total do contêiner pai */
  height: 350px; /* Altura fixa para o carrossel, ajustável */
  margin: 0 auto; /* Centraliza o banner */
}
.carousel-wrapper {
  width: calc(100%); /* Ajuste o número de imagens aqui */
  height: 100%; /* Faz o wrapper ocupar a altura total do carrossel */
}
.carousel-slide {
  width: 100%;
  height: 100%; /* Faz o slide ocupar a altura total do carrossel */
}

/* Ajuste da imagem para preencher o slide */
.carousel-slide img {
  width: 100%;
  height: 100%;
  object-fit: cover; /* Garante que a imagem cubra toda a área, cortando se necessário */
  display: block; /* Remove possíveis espaços extras */
}
</style>