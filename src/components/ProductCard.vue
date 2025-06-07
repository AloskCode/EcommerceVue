<template>
  <div class="border rounded-xl p-4 shadow hover:shadow-lg transition w-full max-w-xs mx-auto">
    <img
      :src="product.thumbnail"
      :alt="product.title"
      class="h-40 w-full object-cover rounded"
    />

    <h2 class="text-base sm:text-lg font-semibold mt-2 line-clamp-2">
      {{ product.title }}
    </h2>

    <p class="text-gray-600 text-sm sm:text-base">${{ product.price }}</p>

    <router-link
      :to="`/product/${product.id}`"
      class="text-blue-500 hover:underline text-xs sm:text-sm"
    >
      Ver detalhes
    </router-link>
  </div>
</template>

<script setup>
defineProps(['product'])
</script>
