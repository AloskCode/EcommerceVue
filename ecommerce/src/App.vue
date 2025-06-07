<template>
  <div>
    <Navbar />
    <CategoryBar />
    <router-view :key="$route.fullPath" />
    <Footer />
  </div>
  
</template>

<script setup>
import { reactive, provide } from 'vue'
import { useRoute } from 'vue-router'

import Navbar from './components/Navbar.vue'
import CategoryBar from './components/CategoryBar.vue'
import Footer from './components/Footer.vue'

const route = useRoute()

// Carrinho com todos os métodos necessários
const cart = reactive({
  items: [],

  add(product) {
    const existingItem = cart.items.find(item => item.id === product.id)
    if (existingItem) {
      existingItem.quantity += 1
    } else {
      cart.items.push({ ...product, quantity: 1 })
    }
  },

  remove(id) {
    cart.items = cart.items.filter(item => item.id !== id)
  },

  increase(id) {
    const item = cart.items.find(item => item.id === id)
    if (item) item.quantity += 1
  },

  decrease(id) {
    const item = cart.items.find(item => item.id === id)
    if (item) {
      if (item.quantity > 1) {
        item.quantity -= 1
      } else {
        cart.remove(id)
      }
    }
  }
})

// Torna o carrinho disponível globalmente
provide('cart', cart)
</script>

