<template>
  <div class="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row">
    <aside class="md:w-1/4 md:pr-8 mb-6 md:mb-0">
      <h3 class="text-lg font-semibold mb-4">Outras Categorias</h3>
      <ul>
        <li v-for="cat in allCategories" :key="cat.slug" class="mb-2">
          <router-link
            :to="{ name: 'CategoryView', params: { category: cat.slug } }"
            :class="{
              'font-bold text-blue-600': selectedCategorySlug === cat.slug,
              'text-gray-700 hover:text-blue-600': selectedCategorySlug !== cat.slug
            }"
            class="block p-2 rounded hover:bg-blue-50 capitalize"
            @click="updateCategory(cat.slug)"
          >
            {{ formatCategory(cat.name) }}
          </router-link>
        </li>
      </ul>
    </aside>

    <main class="md:w-3/4">
      <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-6">
        <h2 class="text-2xl font-bold capitalize mb-2 sm:mb-0">{{ formatCategory(selectedCategoryName) }}</h2>
        
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
const allCategories = ref([]); 
const selectedCategorySlug = ref(''); 
const selectedCategoryName = ref(''); 
const sortBy = ref('default');
const loading = ref(true); 

/**
 * Busca produtos de uma categoria específica na API.
 * @param {string} categorySlug - O slug da categoria a ser buscada.
 */
const fetchProductsByCategory = async (categorySlug) => {
  console.log("Chamando fetchProductsByCategory com slug:", categorySlug); // DEBUG
  loading.value = true;
  try {
    // Faz a requisição GET para a API para obter produtos por categoria
    const res = await axios.get(`https://dummyjson.com/products/category/${categorySlug}`);
    console.log("Resposta da API de produtos por categoria:", res.data); // DEBUG

    // Verifica se a resposta da API contém um array de produtos válido
    if (res.data && Array.isArray(res.data.products)) {
      products.value = res.data.products; 
    } else {
      console.warn("Estrutura da resposta da API inesperada ou sem produtos.");
      products.value = [];
    }

    applySorting(); // Aplica a ordenação inicial após carregar os produtos
  } catch (error) {
    console.error(`Erro ao buscar produtos da categoria ${categorySlug}:`, error);
    products.value = []; 
  } finally {
    loading.value = false; // Define o estado de carregamento como falso, independentemente do sucesso ou erro
  }
};

/**
 * Busca todas as categorias disponíveis na API para preencher a barra lateral.
 */
const fetchAllCategories = async () => {
  try {
    const res = await axios.get('https://dummyjson.com/products/categories');
    console.log("Resposta da API de todas as categorias:", res.data); // DEBUG

    // Adaptação para a estrutura da API dummyjson.com, que pode retornar slugs ou objetos com name/slug
    if (Array.isArray(res.data) && res.data.length > 0 && typeof res.data[0] === 'object' && res.data[0] !== null) {
      allCategories.value = res.data.map(item => ({ slug: item.slug || item.name, name: item.name || item.slug }));
    } else if (Array.isArray(res.data)) {
        allCategories.value = res.data.map(item => ({ slug: item, name: item }));
    } else {
        console.warn("Formato inesperado para categorias:", res.data);
        allCategories.value = [];
    }
  } catch (error) {
    console.error("Erro ao buscar todas as categorias:", error);
  }
};

/**
 * Formata o texto da categoria (ex: 'smartphones' -> 'Smartphones', 'laptops' -> 'Laptops').
 * Remove hífens e capitaliza a primeira letra.
 * @param {string} catText - O slug ou nome da categoria.
 * @returns {string} O nome da categoria formatado.
 */
const formatCategory = (catText) => {
  if (!catText) return '';
  // Substitui hífens por espaços e capitaliza a primeira letra de cada palavra
  return catText.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
};


/**
 * Aplica a ordenação aos produtos exibidos com base na opção selecionada.
 */
const applySorting = () => {
  let sorted = [...products.value]; // Cria uma cópia do array de produtos para não modificar o original

  if (sortBy.value === 'price_asc') {
    sorted.sort((a, b) => a.price - b.price); // Ordena por preço crescente
  } else if (sortBy.value === 'price_desc') {
    sorted.sort((a, b) => b.price - a.price); // Ordena por preço decrescente
  } else if (sortBy.value === 'name_asc') {
    sorted.sort((a, b) => a.title.localeCompare(b.title)); // Ordena por nome (A-Z)
  } else if (sortBy.value === 'name_desc') {
    sorted.sort((a, b) => b.title.localeCompare(a.title)); // Ordena por nome (Z-A)
  }
  filteredProducts.value = sorted; // Atualiza a lista de produtos filtrados/ordenados
};

/**
 * Chamada quando a opção de ordenação é alterada.
 */
const sortProducts = () => {
  applySorting();
};

/**
 * Atualiza a categoria selecionada e navega para a rota correspondente.
 * Esta função agora é um wrapper para o router.push.
 * @param {string} newSlug - O novo slug da categoria selecionada.
 */
const updateCategory = (newSlug) => {
    router.push({ name: 'CategoryView', params: { category: newSlug } });
};

// Observa mudanças no parâmetro 'category' da rota
watch(() => route.params.category, (newCategorySlug) => {
  console.log("Watcher detectou mudança de categoria para:", newCategorySlug); // DEBUG
  if (newCategorySlug) {
    selectedCategorySlug.value = newCategorySlug; // Atualiza o slug da categoria selecionada
    // Encontra o nome completo da categoria no array de todas as categorias
    const categoryFound = allCategories.value.find(cat => cat.slug === newCategorySlug);
    selectedCategoryName.value = categoryFound ? categoryFound.name : newCategorySlug; 
    fetchProductsByCategory(newCategorySlug); // Busca os produtos da nova categoria
  } 
  else {
    // Caso não haja um slug de categoria na rota (ex: rota de "todas as categorias")
    selectedCategorySlug.value = ''; // Limpa a categoria selecionada
    selectedCategoryName.value = 'Todos os Produtos'; // Define um nome padrão
    products.value = []; // Limpa os produtos
    loading.value = false; // Desativa o carregamento
  }
}, { immediate: true }); // Executa o watcher imediatamente na montagem do componente

// Hook de ciclo de vida: chamado após o componente ser montado no DOM
onMounted(() => {
  console.log("CategoryView montado."); // DEBUG
  fetchAllCategories(); // Busca todas as categorias para preencher a barra lateral
  // A busca inicial de produtos por categoria já é tratada pelo watcher com `immediate: true`.
});
</script>

<style scoped>
/*
  Você pode adicionar estilos específicos para este componente aqui,
  mas para a responsividade, o Tailwind CSS já faz a maior parte do trabalho.
*/
</style>