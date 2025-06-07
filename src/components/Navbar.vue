<template>
  <header class="bg-white shadow sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-4">
      <router-link to="/" class="text-2xl font-bold text-blue-600">AOCE</router-link>

      <div class="w-full sm:flex-1 sm:mx-4 relative">
        <input
          v-model="searchTerm"
          @input="searchProducts"
          type="text"
          placeholder="Buscar produtos..."
          class="w-full border rounded-full py-2 px-4 pl-10 shadow-sm focus:outline-none focus:ring focus:ring-blue-200"
        />
        <svg
          class="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5"
          xmlns="http://www.w3.org/2000/svg"
          fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 103.5 3.5a7.5 7.5 0 0013.65 13.65z"/>
        </svg>

        <div v-if="results.length" class="absolute bg-white border rounded w-full mt-1 max-h-60 overflow-auto z-50 shadow">
          <router-link
            v-for="product in results"
            :key="product.id"
            :to="`/product/${product.id}`"
            class="block px-4 py-2 hover:bg-gray-100 text-sm truncate"
            @click="clearSearch"
          >
            {{ product.title }}
          </router-link>
        </div>
      </div>

      <div class="flex flex-wrap sm:flex-nowrap items-center justify-center sm:justify-end gap-4 sm:gap-6">
        <div class="flex items-center gap-1 cursor-pointer text-gray-700 hover:text-blue-600 text-sm">
          <i class="fa-regular fa-heart"></i>
          <span>Lista de desejos</span>
        </div>

        <div class="relative" @mouseenter="showMenu = true" @mouseleave="showMenu = false">
          <div class="flex items-center gap-1 cursor-pointer text-gray-700 hover:text-blue-600 text-sm">
            <i class="fa-regular fa-user"></i>
            <span>Entrar</span>
          </div>
          <div
            v-if="showMenu"
            class="absolute right-0 mt-2 bg-white border rounded shadow w-40 z-50 text-sm"
          >
            <a href="#" class="block px-4 py-2 hover:bg-gray-100">Entrar</a>
            <a href="#" class="block px-4 py-2 hover:bg-gray-100">Meus pedidos</a>
            <a href="#" class="block px-4 py-2 hover:bg-gray-100">Endereço</a>
          </div>
        </div>

        <router-link to="/cart" class="relative cursor-pointer text-gray-700 hover:text-blue-600">
          <i class="fa-solid fa-cart-shopping"></i>
          <span
            v-if="cart.items.length"
            class="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center"
          >
            {{ cart.items.length }}
          </span>
        </router-link>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue';
import axios from 'axios'; 
import { inject } from 'vue'; 

const searchTerm = ref('');
const results = ref([]);
const showMenu = ref(false);
const cart = inject('cart');

const searchProducts = async () => {
  if (searchTerm.value.trim() === '') {
    results.value = [];
    return;
  }

  const res = await axios.get(`https://dummyjson.com/products/search?q=${searchTerm.value}`);
  results.value = res.data.products;
};

const clearSearch = () => {
  searchTerm.value = '';
  results.value = [];
};
</script>

<style scoped>
</style>
