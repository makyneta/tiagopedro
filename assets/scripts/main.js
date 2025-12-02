// script.js - CÓDIGO CONSOLIDADO E CORRIGIDO (NAVEGAÇÃO, MODAL E LOCAL STORAGE)

// 1. Variáveis de Elementos DOM e Local Storage Key
const header = document.getElementById('main-header');
const nav = document.getElementById('main-nav');
const menuToggle = document.querySelector('.menu-toggle');

const modal = document.getElementById('galleryModal');
const openBtn = document.getElementById('openGalleryBtn');
const closeBtn = document.querySelector('.close-btn');

// CHAVE DE ARMAZENAMENTO NO NAVEGADOR
const FAVORITES_KEY = 'tiagopedro_favoritas';


// -------------------------------------------------------------------
// 2. CONTROLE DO MODAL COM ANIMAÇÃO (Definido Primeiro)
// -------------------------------------------------------------------

// Função para abrir o modal (usado pelo botão e nos eventos abaixo)
function openModal(e) {
    if (e) e.preventDefault();
    if (modal) {
        modal.classList.add('active'); 
        document.body.style.overflow = 'hidden'; 
    }
}

// Função para fechar o modal
function closeModal() {
    if (modal) {
        modal.classList.remove('active'); 
        document.body.style.overflow = 'auto'; 
    }
}

if (openBtn) {
    openBtn.addEventListener('click', openModal);
}
if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
}
window.addEventListener('click', function(event) {
    if (event.target === modal) {
        closeModal();
    }
});


// -------------------------------------------------------------------
// 3. FUNCIONALIDADES DE NAVEGAÇÃO E SCROLL
// -------------------------------------------------------------------

// Menu Responsivo (Hamburger)
menuToggle.addEventListener('click', () => {
    nav.classList.toggle('active');
    menuToggle.classList.toggle('open'); 
});

// Efeito de Scroll no Header
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// Smooth Scroll e Fechar Menu
document.querySelectorAll('#main-nav a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetElement = document.querySelector(this.getAttribute('href'));
        if (targetElement) {
            targetElement.scrollIntoView({
                behavior: 'smooth'
            });
        }
        
        // 🟢 FECHAR O MENU MOBILE E O MODAL, SE ESTIVER ABERTO (APENAS UM AJUSTE)
        if (window.innerWidth <= 768) {
            nav.classList.remove('active');
            menuToggle.classList.remove('open');
            
            // Certifica-se de fechar o modal também se for um link interno.
            // closeModal(); // Comentado, pois o clique num link interno geralmente não fecha o modal
        }
    });
});


// -------------------------------------------------------------------
// 4. FUNCIONALIDADE DE FAVORITOS (Com Local Storage)
// -------------------------------------------------------------------

/**
 * Salva a lista de IDs das fotos favoritas no localStorage.
 */
function saveFavorites() {
    const favoritedItems = document.querySelectorAll('.modal-item.favorited');
    const favoriteIds = Array.from(favoritedItems).map(item => 
        item.getAttribute('data-photo-id')
    );
    
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(favoriteIds));
    console.log('Favoritos salvos:', favoriteIds);
}

/**
 * Carrega e aplica a classe 'favorited' aos itens ao iniciar.
 */
function loadFavorites() {
    const favoritesString = localStorage.getItem(FAVORITES_KEY);
    const favoriteIds = favoritesString ? JSON.parse(favoritesString) : [];
    
    favoriteIds.forEach(id => {
        const item = document.querySelector(`.modal-item[data-photo-id="${id}"]`);
        if (item) {
            item.classList.add('favorited');
            const button = item.querySelector('.add-fav-btn');
            if (button) {
                button.textContent = 'Remover dos Favoritos';
            }
        }
    });
    console.log('Favoritos carregados:', favoriteIds);
}


// LÓGICA DE CLIQUE (Adicionar/Remover)
document.querySelectorAll('.add-fav-btn').forEach(button => {
    button.addEventListener('click', function() {
        const item = this.closest('.modal-item');
        
        item.classList.toggle('favorited');
        
        // Atualizar o texto do botão
        if (item.classList.contains('favorited')) {
            this.textContent = 'Remover dos Favoritos';
        } else {
            this.textContent = 'Adicionar aos Favoritos';
        }
        
        // CHAMA A FUNÇÃO DE SALVAR APÓS CADA MUDANÇA
        saveFavorites();
    });
});

// CARREGA OS FAVORITOS ASSIM QUE O SCRIPT É EXECUTADO
window.addEventListener('load', loadFavorites);