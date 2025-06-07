<template>
  <div class="border rounded-xl p-4 shadow hover:shadow-lg transition">
    <img :src="product.thumbnail" alt="Imagem" class="h-40 w-full object-cover rounded" />
    <h2 class="text-lg font-semibold mt-2">{{ product.title }}</h2>
    <p class="text-gray-600">${{ product.price }}</p>
    <router-link :to="`/product/${product.id}`" class="text-blue-500 hover:underline text-sm">
      Ver detalhes
    </router-link>
  </div>
</template>

<script setup>
defineProps(['product'])
</script>