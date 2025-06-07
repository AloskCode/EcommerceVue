<template>
  <div class="max-w-7xl mx-auto px-4 py-6">
    <!-- Ordenação -->
    <div class="flex justify-end mb-4">
      <select
        v-model="sortOption"
        @change="sortProducts"
        class="border border-gray-300 rounded px-3 py-1 text-sm"
      >
        <option disabled value="">Ordenar por</option>
        <option value="title-asc">Nome (A-Z)</option>
        <option value="title-desc">Nome (Z-A)</option>
        <option value="price-asc">Preço (Menor primeiro)</option>
        <option value="price-desc">Preço (Maior primeiro)</option>
      </select>
    </div>

    <!-- Grid de produtos -->
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
    <router-link
    v-for="product in products"
    :key="product.id"
    :to="{ name: 'ProductDetail', params: { id: product.id } }"
    class="bg-white rounded-lg border shadow p-4 flex flex-col hover:shadow-lg transition duration-200"
  >
    <img :src="product.thumbnail" alt="" class="w-full h-48 object-cover rounded" />
    <h2 class="mt-2 text-sm font-medium text-gray-800">{{ product.title }}</h2>
    <p class="text-blue-600 font-semibold mt-1">${{ product.price }}</p>
  </router-link>
    </div>

    <!-- Paginação -->
    <div class="flex justify-center mt-6 gap-2">
      <button
        @click="changePage(currentPage - 1)"
        :disabled="currentPage === 1"
        class="px-3 py-1 border rounded disabled:opacity-50"
      >
        Anterior
      </button>

      <button
        v-for="page in totalPages"
        :key="page"
        @click="changePage(page)"
        :class="[
          'px-3 py-1 border rounded',
          page === currentPage ? 'bg-blue-500 text-white' : 'bg-white'
        ]"
      >
        {{ page }}
      </button>

      <button
        @click="changePage(currentPage + 1)"
        :disabled="currentPage === totalPages"
        class="px-3 py-1 border rounded disabled:opacity-50"
      >
        Próxima
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import axios from 'axios'

const products = ref([])
const total = ref(0)
const limit = 20
const currentPage = ref(1)
const totalPages = ref(1)
const sortOption = ref('')

// Buscar produtos com paginação
const fetchProducts = async () => {
  const skip = (currentPage.value - 1) * limit
  const res = await axios.get(
    `https://dummyjson.com/products?limit=${limit}&skip=${skip}`
  )
  products.value = res.data.products
  total.value = res.data.total
  totalPages.value = Math.ceil(total.value / limit)

  // aplicar ordenação se necessário
  sortProducts()
}

const changePage = (page) => {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

const sortProducts = () => {
  switch (sortOption.value) {
    case 'title-asc':
      products.value.sort((a, b) => a.title.localeCompare(b.title))
      break
    case 'title-desc':
      products.value.sort((a, b) => b.title.localeCompare(a.title))
      break
    case 'price-asc':
      products.value.sort((a, b) => a.price - b.price)
      break
    case 'price-desc':
      products.value.sort((a, b) => b.price - a.price)
      break
  }
}

// refetch sempre que mudar de página
watch(currentPage, fetchProducts)
onMounted(fetchProducts)
</script>