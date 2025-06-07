<template>
  <nav class="bg-gray-100 shadow-inner py-2 px-4 relative">
    <div class="max-w-7xl mx-auto flex justify-center items-center gap-4 flex-wrap relative">
      <div class="relative">
        <button
          @click="toggleDropdown"
          class="flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-blue-600 whitespace-nowrap"
        >
          <span class="text-lg">☰</span> Todas as Categorias
        </button>

        <transition name="fade">
          <div
            v-if="showAll"
            class="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-white border rounded shadow-md w-72 z-50 max-h-80 overflow-y-auto"
            @mouseleave="showAll = false"
          >
            <ul>
              <li
                v-for="catObj in allCategories"
                :key="catObj.slug"
                @click="goToCategory(catObj.slug)"
                class="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
              >
                <span>{{ formatCategory(catObj.name) }}</span>
              </li>
            </ul>
          </div>
        </transition>
      </div>

      <button
        v-for="catSlug in fixedCategories"
        :key="catSlug"
        @click="goToCategory(catSlug)"
        class="text-sm px-3 py-1 rounded-full bg-white hover:bg-blue-100 text-gray-700 border whitespace-nowrap"
      >
        {{ formatCategory(catSlug) }}
      </button>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted } from 'vue'; // Importa funcionalidades reativas do Vue
import { useRouter } from 'vue-router'; // Importa o hook para manipulação de rotas
import axios from 'axios'; 

const router = useRouter(); 
const showAll = ref(false);
const allCategories = ref([]); 

// Categorias fixas que serão exibidas como botões individuais na barra de navegação
const fixedCategories = [
  'smartphones',
  'fragrances',
  'mens-shoes',
  'furniture',
  'groceries',
];


const toggleDropdown = () => {
  showAll.value = !showAll.value;
};

/**
 * Navega para a página de uma categoria específica.
 * @param {string} categorySlug 
 */
const goToCategory = (categorySlug) => {
  router.push({ name: 'CategoryView', params: { category: categorySlug } });
  showAll.value = false;
};

/**
 * @param {string} catText - 
 * @returns {string} 
 */
const formatCategory = (catText) => {
  if (typeof catText !== 'string' || !catText) {
    return ''; // Retorna vazio se não for string ou for vazia
  }
  return catText.charAt(0).toUpperCase() + catText.slice(1).replace(/-/g, ' ');
};

/*
 * Busca todas as categorias da API e as armazena em 'allCategories'.
 */
const fetchCategories = async () => {
  try {
    const res = await axios.get('https://dummyjson.com/products/categories');
    // Mapeia para um formato { slug, name } se a API retornar objetos
    if (Array.isArray(res.data) && res.data.length > 0 && typeof res.data[0] === 'object') {
      allCategories.value = res.data.map(item => ({ slug: item.slug || item.name, name: item.name || item.slug }));
    } else {
      // Se for array de strings, cria objetos simples { slug: string, name: string }
      allCategories.value = res.data.map(item => ({ slug: item, name: item }));
    }
  } catch (error) {
    console.error("Erro ao buscar categorias:", error);
  }
};

// Hook de ciclo de vida: executa quando o componente é montado
onMounted(() => {
  fetchCategories();

  document.addEventListener('click', (event) => {
    const dropdownContainer = document.querySelector('.relative > div');
    const toggleButton = document.querySelector('.relative > button');

    // Se o dropdown estiver visível e o clique não for dentro do dropdown ou no botão de toggle, fecha o dropdown.
    if (showAll.value && dropdownContainer && !dropdownContainer.contains(event.target) && !toggleButton.contains(event.target)) {
      showAll.value = false;
    }
  });
});
</script>

<style scoped>

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease; 
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>