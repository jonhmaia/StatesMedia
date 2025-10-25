// JavaScript para interatividade e funcionalidades dinâmicas

document.addEventListener('DOMContentLoaded', function() {
    // Inicialização das funcionalidades
    initializeNavigation();
    initializeCards();
    initializeTheme();
    initializeAnimations();
    initializeTooltips();
});

// Navegação dinâmica
function initializeNavigation() {
    const navLinks = document.querySelectorAll('.sidebar .nav-link');
    const contentSections = document.querySelectorAll('.content-section');

    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Remove active class from all links
            navLinks.forEach(l => l.classList.remove('active'));
            
            // Add active class to clicked link
            this.classList.add('active');
            
            // Get target section
            const targetId = this.getAttribute('href').substring(1);
            const targetSection = document.getElementById(targetId);
            
            // Hide all sections
            contentSections.forEach(section => {
                section.style.display = 'none';
            });
            
            // Show target section with animation
            if (targetSection) {
                targetSection.style.display = 'block';
                targetSection.classList.add('fade-in-up');
                
                // Scroll to top of section
                targetSection.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// Funcionalidades dos cards
function initializeCards() {
    const cards = document.querySelectorAll('.custom-card');
    
    cards.forEach(card => {
        // Adiciona efeito de hover
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-5px)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0)';
        });
        
        // Adiciona funcionalidade de clique para expandir
        const cardHeader = card.querySelector('.card-header');
        if (cardHeader) {
            cardHeader.style.cursor = 'pointer';
            cardHeader.addEventListener('click', function() {
                const cardBody = card.querySelector('.card-body');
                if (cardBody) {
                    cardBody.style.display = cardBody.style.display === 'none' ? 'block' : 'none';
                    
                    // Adiciona ícone de expansão
                    const icon = cardHeader.querySelector('.expand-icon');
                    if (icon) {
                        icon.style.transform = cardBody.style.display === 'none' ? 'rotate(0deg)' : 'rotate(180deg)';
                    }
                }
            });
        }
    });
}



// Sistema de temas
function initializeTheme() {
    const themeToggle = document.getElementById('themeToggle');
    const currentTheme = localStorage.getItem('theme') || 'light';
    
    // Aplicar tema salvo
    document.documentElement.setAttribute('data-theme', currentTheme);
    
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('theme', newTheme);
            
            // Atualizar ícone do botão
            const icon = this.querySelector('i');
            if (icon) {
                icon.className = newTheme === 'dark' ? 'fas fa-sun' : 'fas fa-moon';
            }
        });
    }
}

// Animações de entrada
function initializeAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    // Observar elementos para animação
    const animatedElements = document.querySelectorAll('.custom-card, .content-section');
    animatedElements.forEach(el => observer.observe(el));
}

// Tooltips do Bootstrap
function initializeTooltips() {
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function (tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });
}

// Funcionalidades utilitárias
const Utils = {
    // Copiar texto para clipboard
    copyToClipboard: function(text) {
        navigator.clipboard.writeText(text).then(function() {
            Utils.showNotification('Texto copiado para a área de transferência!', 'success');
        });
    },
    
    // Mostrar notificações
    showNotification: function(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `alert alert-${type} alert-dismissible fade show position-fixed`;
        notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
        notification.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        document.body.appendChild(notification);
        
        // Auto remove after 3 seconds
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 3000);
    },
    
    // Formatar data
    formatDate: function(date) {
        return new Intl.DateTimeFormat('pt-BR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(new Date(date));
    },
    
    // Validar email
    validateEmail: function(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
};

// Exportar utilitários para uso global
window.ProjectUtils = Utils;