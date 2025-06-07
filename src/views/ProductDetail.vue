<template>
  <div class="max-w-4xl mx-auto px-4 py-6">
    <div v-if="loading" class="text-center text-gray-600">Carregando detalhes do produto...</div>
    <div v-else-if="!product" class="text-center text-red-600">Produto não encontrado.</div>
    <div v-else class="flex flex-col md:flex-row gap-6">
      <img :src="product.thumbnail" :alt="product.title" class="w-full md:w-1/2 object-cover rounded shadow" />

      <div class="flex-1">
        <h1 class="text-2xl font-bold mb-2">{{ product.title }}</h1>
        <p class="text-gray-600 mb-4">{{ product.description }}</p>
        <p class="text-xl text-blue-600 font-semibold mb-2">${{ product.price }}</p>
        <p class="text-sm text-gray-500 mb-4">Categoria: {{ product.category }}</p>
        <p class="text-sm text-green-600" v-if="product.stock > 0">Em estoque: {{ product.stock }}</p>
        <p class="text-sm text-red-600" v-else>Fora de estoque</p>

        <!-- Botões -->
        <div class="flex flex-col items-start mt-6 space-y-3">
          <button
            @click="addToCart"
            :disabled="product.stock <= 0"
            class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 w-40">
            Adicionar ao Carrinho
          </button>

          <button
            @click="router.back()"
            class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 w-40">
            Voltar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, inject } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axios from 'axios'

const route = useRoute()
const router = useRouter()
const product = ref(null)
const loading = ref(true)

const cart = inject('cart')

// Verificação opcional para garantir que o cart está disponível
if (!cart || typeof cart.add !== 'function') {
  console.warn("Objeto 'cart' não injetado corretamente ou método 'add' ausente.")
}

// Função para buscar os detalhes do produto
const fetchProductDetails = async (productId) => {
  loading.value = true
  product.value = null
  try {
    const res = await axios.get(`https://dummyjson.com/products/${productId}`)
    product.value = res.data
  } catch (error) {
    console.error("Erro ao buscar detalhes do produto:", error)
    product.value = null
  } finally {
    loading.value = false
  }
}

// Carrega os detalhes ao montar ou quando muda o ID
watch(() => route.params.id, (newId) => {
  if (newId) fetchProductDetails(newId)
}, { immediate: true })

// Adiciona o produto ao carrinho
const addToCart = () => {
  if (!product.value || !cart || typeof cart.add !== 'function') return
  cart.add(product.value)
  alert(`Produto "${product.value.title}" adicionado ao carrinho!`)
}
</script>
