<template>
  <div class="p-6 max-w-4xl mx-auto">
    <h1 class="text-3xl font-bold mb-6 text-gray-800">Carrinho de Compras</h1>

    <div v-if="cartItems.length === 0" class="bg-yellow-50 text-yellow-800 p-4 rounded shadow-sm">
      <p>Seu carrinho está vazio.</p>
    </div>

    <div v-else class="space-y-4">
      <div
        v-for="item in cartItems"
        :key="item.id"
        class="bg-white rounded-xl shadow-md p-4 flex flex-col sm:flex-row items-center justify-between" 
        >
        <div class="flex items-center gap-4 mb-4 sm:mb-0">
          <img
            :src="item.thumbnail"
            class="w-24 h-24 object-cover rounded-lg border"
            :alt="item.title"
          />
          <div>
            <h2 class="font-semibold text-lg text-gray-800">{{ item.title }}</h2>
            <p class="text-sm text-gray-500">R$ {{ item.price.toFixed(2) }}</p>
          </div>
        </div>

        <div class="flex items-center gap-2">
          <button
            @click="decreaseQuantity(item.id)"
            class="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded text-lg font-semibold"
          >−</button>

          <span class="text-base font-medium px-2">{{ item.quantity }}</span>

          <button
            @click="increaseQuantity(item.id)"
            class="bg-gray-200 hover:bg-gray-300 px-3 py-1 rounded text-lg font-semibold"
          >+</button>

          <button
            @click="removeItem(item.id)"
            class="ml-4 text-red-500 hover:text-red-600 text-sm font-medium"
          >
            Remover
          </button>
        </div>
      </div>

      <div class="text-right mt-6 space-y-4">
        <p class="text-xl font-bold text-gray-800">
          Total: <span class="text-green-600">R$ {{ total.toFixed(2) }}</span>
        </p>

        <button
          @click="checkout"
          class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded text-lg font-semibold"
        >
          Finalizar Compra
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, inject } from 'vue'; 

// Injeta o objeto 'cart' que deve ser fornecido por um componente pai (geralmente App.vue)
const cart = inject('cart');

// Verifica se o objeto 'cart' foi injetado com sucesso.
// Se não, lança um erro para indicar um problema de configuração.
if (!cart) {
  throw new Error("Carrinho não foi injetado. Verifique se 'provide' está funcionando.");
}

// Propriedade computada para acessar os itens do carrinho de forma reativa.
const cartItems = computed(() => cart.items);

/**
 * Aumenta a quantidade de um item específico no carrinho.
 * @param {number} id - O ID do produto a ser incrementado.
 */
const increaseQuantity = (id) => {
  if (cart.increase) cart.increase(id);
};

/**
 * Diminui a quantidade de um item específico no carrinho.
 * @param {number} id - O ID do produto a ser decrementado.
 */
const decreaseQuantity = (id) => {
  if (cart.decrease) cart.decrease(id);
};

/**
 * Remove um item do carrinho.
 * @param {number} id - O ID do produto a ser removido.
 */
const removeItem = (id) => {
  if (cart.remove) cart.remove(id);
};

// Propriedade computada para calcular o valor total de todos os itens no carrinho.
// Reduz o array de itens, somando (preço * quantidade) de cada um.
const total = computed(() =>
  cart.items.reduce((acc, item) => acc + item.price * item.quantity, 0)
);

/**
 * Simula o processo de finalização da compra.
 * Exibe um alerta de sucesso e limpa o carrinho.
 */
const checkout = () => {
  if (cartItems.value.length === 0) {
    alert('Seu carrinho está vazio. Adicione produtos antes de finalizar a compra.');
    return;
  }

  alert('Compra finalizada com sucesso!'); 
  cart.items = []; // Limpa o carrinho após a finalização
};
</script>