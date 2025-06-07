<template>
  <div class="relative max-w-7xl mx-auto py-6">
    <h2 class="text-xl font-semibold mb-4 px-4">Em Destaque</h2>

    <div class="flex items-center">
      <!-- Botão esquerda -->
      <button @click="prevSlide" class="z-10 px-3 text-xl">
        ‹
      </button>

      <!-- Carrossel -->
      <div class="overflow-hidden w-full">
        <div
          class="flex transition-transform duration-500 ease-in-out"
          :style="{ transform: `translateX(-${currentIndex * slideWidth}%)` }"
        >
          <div
            v-for="product in products"
            :key="product.id"
            class="w-1/4 px-2 shrink-0"
          >
            <router-link :to="`/product/${product.id}`">
              <div class="bg-white shadow rounded p-4 flex flex-col">
                <img
                  :src="product.thumbnail"
                  alt=""
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

      <!-- Botão direita -->
      <button @click="nextSlide" class="z-10 px-3 text-xl">
        ›
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

const products = ref([])
const currentIndex = ref(0)
const itemsPerPage = 4
const slideWidth = 25 // 100 / 4 produtos por slide

const fetchProducts = async () => {
  const res = await axios.get('https://dummyjson.com/products?limit=40')
  products.value = res.data.products
}

const nextSlide = () => {
  if ((currentIndex.value + 1) * itemsPerPage < products.value.length) {
    currentIndex.value++
  } else {
    currentIndex.value = 0
  }
}

const prevSlide = () => {
  if (currentIndex.value > 0) {
    currentIndex.value--
  } else {
    currentIndex.value = Math.max(Math.ceil(products.value.length / itemsPerPage) - 1, 0)
  }
}

onMounted(fetchProducts)
</script>

<style scoped>
.flex > .w-1\/4 {
  flex: 0 0 25%;
}
</style>
