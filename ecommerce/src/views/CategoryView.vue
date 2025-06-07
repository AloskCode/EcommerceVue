<template>
  <div class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row">
    <aside class="md:w-1/4 md:pr-8 mb-6 md:mb-0">
      <h3 class="text-lg font-semibold mb-4">Outras Categorias</h3>
      <ul>
        <li v-for="cat in allCategories" :key="cat.slug" class="mb-2">
          <router-link
            :to="{ name: 'CategoryView', params: { category: cat.slug } }"
            :class="{'font-bold text-blue-600': selectedCategorySlug === cat.slug, 'text-gray-700 hover:text-blue-600': selectedCategorySlug !== cat.slug}"
            class="block p-2 rounded hover:bg-blue-50 capitalize"
            @click="updateCategory(cat.slug)"
          >
            {{ formatCategory(cat.name) }}
          </router-link>
        </li>
      </ul>
    </aside>

    <main class="md:w-3/4">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-2xl font-bold capitalize">{{ formatCategory(selectedCategoryName) }}</h2>
        <div class="flex items-center space-x-4">
          <label for="sort" class="text-gray-700">Ordenar por:</label>
          <select id="sort" v-model="sortBy" @change="sortProducts" class="border rounded px-3 py-1">
            <option value="default">Padrão</option>
            <option value="price_asc">Preço (Menor para Maior)</option>
            <option value="price_desc">Preço (Maior para Menor)</option>
            <option value="name_asc">Nome (A-Z)</option>
            <option value="name_desc">Nome (Z-A)</option>
          </select>
        </div>
      </div>

      <div v-if="loading" class="text-center text-gray-500">Carregando produtos...</div>
      <div v-else-if="filteredProducts.length === 0" class="text-center text-gray-500">
        Nenhum produto encontrado nesta categoria.
      </div>
      <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div v-for="product in filteredProducts" :key="product.id" class="bg-white shadow rounded-lg p-4">
          <router-link :to="{ name: 'ProductDetail', params: { id: product.id } }">
            <img :src="product.thumbnail" :alt="product.title" class="w-full h-48 object-cover rounded-md mb-4" />
            <h3 class="text-lg font-semibold mb-2">{{ product.title }}</h3>
            <p class="text-gray-600 mb-2">{{ product.description.substring(0, 70) }}...</p>
            <p class="text-blue-600 font-bold text-xl">R$ {{ product.price.toFixed(2) }}</p>
          </router-link>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';

const route = useRoute();
const router = useRouter();

const products = ref([]);
const filteredProducts = ref([]);
const allCategories = ref([]); // Para exibir as outras categorias
const selectedCategorySlug = ref('');
const selectedCategoryName = ref('');
const sortBy = ref('default');
const loading = ref(true);

const fetchProductsByCategory = async (categorySlug) => {
  console.log("Chamando fetchProductsByCategory com slug:", categorySlug); // DEBUG: Verificar o slug
  loading.value = true;
  try {
    // API endpoint para buscar produtos por categoria
    const res = await axios.get(`https://dummyjson.com/products/category/${categorySlug}`);
    console.log("Resposta da API de produtos por categoria:", res.data); // DEBUG: Verificar a resposta
    
    // A DummyJSON API retorna um objeto com uma propriedade 'products' que é um array
    if (res.data && Array.isArray(res.data.products)) {
      products.value = res.data.products;
    } else {
      console.warn("Estrutura da resposta da API inesperada ou sem produtos.");
      products.value = [];
    }
    
    applySorting(); // Aplica a ordenação inicial após carregar
  } catch (error) {
    console.error(`Erro ao buscar produtos da categoria ${categorySlug}:`, error);
    products.value = [];
  } finally {
    loading.value = false;
  }
};

const fetchAllCategories = async () => {
  try {
    const res = await axios.get('https://dummyjson.com/products/categories');
    console.log("Resposta da API de todas as categorias:", res.data); // DEBUG: Verificar todas as categorias
    // Mapeia para um formato { slug, name } se a API retornar objetos
    if (Array.isArray(res.data) && res.data.length > 0 && typeof res.data[0] === 'object') {
      allCategories.value = res.data.map(item => ({ slug: item.slug || item.name, name: item.name || item.slug }));
    } else {
      // Se for array de strings, crie objetos simples
      allCategories.value = res.data.map(item => ({ slug: item, name: item }));
    }
  } catch (error) {
    console.error("Erro ao buscar todas as categorias:", error);
  }
};

const formatCategory = (catText) => {
  if (!catText) return '';
  return catText.charAt(0).toUpperCase() + catText.slice(1).replace(/-/g, ' ');
};

const applySorting = () => {
  let sorted = [...products.value]; // Cria uma cópia para não modificar o array original

  if (sortBy.value === 'price_asc') {
    sorted.sort((a, b) => a.price - b.price);
  } else if (sortBy.value === 'price_desc') {
    sorted.sort((a, b) => b.price - a.price);
  } else if (sortBy.value === 'name_asc') {
    sorted.sort((a, b) => a.title.localeCompare(b.title));
  } else if (sortBy.value === 'name_desc') {
    sorted.sort((a, b) => b.title.localeCompare(a.title));
  }
  filteredProducts.value = sorted;
};

const sortProducts = () => {
  applySorting();
};

const updateCategory = (newSlug) => {
  // Esta função é chamada quando você clica em uma categoria na barra lateral.
  // Ela já dispara a navegação via router-link, e o watcher na rota
  // é quem realmente aciona a busca de produtos.
  // Não precisamos fazer nada aqui além do router-link.
};

// Observa mudanças na rota para carregar produtos da nova categoria
watch(() => route.params.category, (newCategorySlug) => {
  console.log("Watcher detectou mudança de categoria para:", newCategorySlug); // DEBUG: Verificar se o watcher está disparando
  if (newCategorySlug) {
    selectedCategorySlug.value = newCategorySlug;
    // Encontra o nome completo da categoria para exibição no título da página
    const categoryFound = allCategories.value.find(cat => cat.slug === newCategorySlug);
    selectedCategoryName.value = categoryFound ? categoryFound.name : newCategorySlug;
    fetchProductsByCategory(newCategorySlug);
  } else {
    // Se, por algum motivo, a categoria for nula ou indefinida
    selectedCategorySlug.value = '';
    selectedCategoryName.value = 'Todos os Produtos'; // Ou outro texto padrão
    products.value = []; // Limpa os produtos
    loading.value = false;
  }
}, { immediate: true }); // immediate: true executa o watcher na montagem inicial

onMounted(() => {
  console.log("CategoryView montado."); // DEBUG: Verificar se onMounted está rodando
  fetchAllCategories();
  // A busca inicial da categoria é feita pelo watcher graças a { immediate: true }
});
</script>

<style scoped>
/* Adicione aqui qualquer estilo específico para esta view */
</style>