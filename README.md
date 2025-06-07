# EcommerceVue
Criação do Eccomerce com Vue, Axios e Tailwind(CSS)
Thiago Tsuyoshi Okada Aoki RA: 2002282<br>
Guilheme Dorce de Britto<br>

## 🛍️ Descrição do Projeto

Este é um projeto de e-commerce desenvolvido com Vue.js, que simula uma loja virtual com diversas funcionalidades modernas de uma aplicação real. O objetivo é oferecer uma experiência de usuário fluida e organizada, focada na exibição e navegação de produtos.

###  Funcionalidades

- Página inicial com carrossel de banners promocionais
- Barra de navegação com busca de produtos
- Exibição de categorias
- Listagem de produtos por categoria
- Paginação de produtos
- Página de detalhes de produto
- Carrinho de compras
- Componentes reutilizáveis como: Navbar, Footer, ProductCard, etc.

###  Ferramentas
Foram utilizadas as seguintes ferramentas

- **Vue.js 3** para a construção da interface do usuário  
- **Vite** como bundler e ambiente de desenvolvimento rápido  
- **Axios** para consumo de API REST  
- **TailwindCSS** para estilização moderna e responsiva




```bash
# Clone o repositório
git clone https://github.com/seu-usuario/nome-do-repositorio.git

# Acesse a pasta do projeto
cd nome-do-repositorio
##  Estrutura do projeto



```bash
src/
├── assets/
│   └── imagens/
│       ├── banner1.png
│       ├── banner02.png
│       ├── banner03.png
│       └── banner04.png
│
├── components/
│   ├── BannerCarousel.vue
│   ├── CategoryBar.vue
│   ├── Footer.vue
│   ├── HelloWorld.vue
│   ├── Navbar.vue
│   ├── Pagination.vue
│   ├── ProductCard.vue
│   ├── ProductCarousel.vue
│   ├── ProductList.vue
│   └── SearchBar.vue
│
├── router/
│   └── index.js
│
├── views/
│   ├── Cart.vue
│   ├── CategoryView.vue
│   ├── Home.vue
│   └── ProductDetail.vue
│
├── App.vue
└── main.js
```


## Como Rodar o Projeto Localmente

###  Pré-requisitos

- Node.js (versão recomendada: 18.x ou superior)
- npm (gerenciador de pacotes do Node)

### Instalação e execução em uma única linha de comando:

```bash
git clone https://github.com/AloskCode/EcommerceVue && cd nome-do-repositorio && npm install && npm run dev


