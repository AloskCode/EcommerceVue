<template>
    <div class="p-6">
          <div>
            <BannerCarousel />
            <ProductCarousel />
          </div>
        <div v-if="loading" class="text-gray-600">Carregando produtos...</div>
        <ProductList v-else :products="products" />
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import axios from 'axios'

import SearchBar from '../components/SearchBar.vue'
import ProductList from '../components/ProductList.vue'
import Pagination from '../components/Pagination.vue'
import ProductCarousel from '../components/ProductCarousel.vue'
import BannerCarousel from '../components/BannerCarousel.vue';


const products = ref([])
const total = ref(0)
const limit = 20
const skip = ref(0)
const searchQuery = ref('')
const sortOption = ref('')


const fetchProducts = async (page = 1) => {
  skip.value = (page - 1) * limit
  const url = `https://dummyjson.com/products?limit=${limit}&skip=${skip.value}` +
              (sortOption.value ? `&sortBy=${sortOption.value}&order=asc` : '')
  const res = await axios.get(url)
  products.value = res.data.products
  total.value = res.data.total
}
const fetchByCategory = async (category) => {
  const res = await axios.get(`https://dummyjson.com/products/category/${category}`)
  products.value = res.data.products
}

onMounted(fetchProducts)
</script>