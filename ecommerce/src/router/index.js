import { createRouter, createWebHistory } from 'vue-router';
import Home from '../views/Home.vue'; // Renomeado para HomeView para seguir a convenção
import ProductDetail from '../views/ProductDetail.vue'; // Renomeado para ProductDetailView
import CategoryView from '../views/CategoryView.vue';
import Cart from '../views/Cart.vue'

const routes = [
  { 
    path: '/', 
    nome: 'home',
    component: Home, 
  },

  { 
    path: '/product/:id', 
    component: ProductDetail, 
    props: true 
  },
  {
    path: '/produto/:id',
    name: 'ProductDetail',
    component: () => import('@/views/ProductDetail.vue'),
  },
  
  {
    // Rota ÚNICA e PADRONIZADA para visualização de categoria.
    // Usaremos o caminho em inglês para consistência.
    path: '/categories/:category', // CORRIGIDO: Caminho pluralizado para 'categories'
    name: 'CategoryView', // Nome da rota, consistente com CategoryView.vue e CategoryBar.vue
    component: CategoryView, // Importação direta
    props: true,
  },
  // As rotas duplicadas ou com nomes/caminhos inconsistentes foram REMOVIDAS.
  // Isso resolve o erro "No match for..." e garante que o Vue Router saiba para onde ir.

  { 
    path: '/cart', 
    name: 'cart',
    component: Cart
  }, 
];

export default createRouter({
  history: createWebHistory(),
  routes,
});

