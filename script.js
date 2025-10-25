document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const cards = document.querySelectorAll('.card');
    const simulateBtn = document.getElementById('simulateBtn');
    const infoPanel = document.getElementById('infoPanel');
    const infoTitle = document.getElementById('infoTitle');
    const infoDescription = document.getElementById('infoDescription');

    // Information map for each element
    const infoMap = {
        'input': {
            title: '📄 Input - Briefing VSL',
            description: 'Documento PDF contendo o briefing do Video Sales Letter (VSL) que será analisado pelo sistema multi-agente. Este é o ponto de entrada de todo o processo de análise.'
        },
        'orchestrator': {
            title: '🎯 Orquestrador - Todd Brown Agent',
            description: 'Agente principal que coordena todo o processo de análise. Baseado na metodologia de Todd Brown, este agente gerencia a execução sequencial das ferramentas especializadas e compila os resultados finais.'
        },
        'tool2': {
            title: '✅ T2: Análise de Aprovação',
            description: 'Ferramenta especializada "analisarAprovacaoToddBrown" que avalia se o VSL está alinhado com os critérios de aprovação de Todd Brown. Utiliza RAG (base de conhecimento) e THINK (raciocínio) para gerar análise em formato JSON.'
        },
        'tool3': {
            title: '💡 T3: Análise da Big Idea',
            description: 'Ferramenta "analisarBigIdea" que identifica e avalia a Big Idea principal do VSL. Analisa se a proposta central é convincente e está bem estruturada, retornando insights em JSON.'
        },
        'tool4': {
            title: '📊 T4: Pontuação de Seções',
            description: 'Ferramenta "pontuarSeccoesVSL" que avalia cada seção do VSL individualmente, atribuindo pontuações baseadas em critérios específicos. Gera relatório detalhado em formato JSON.'
        },
        'tool5': {
            title: '🚀 T5: Pontos de Melhoria',
            description: 'Ferramenta "gerarPontosDeMelhoria" que identifica oportunidades de otimização no VSL. Sugere melhorias específicas e actionables baseadas na análise completa, retornando recomendações em JSON.'
        },
        'output': {
            title: '📋 Output - Análise Completa',
            description: 'Resultado final que compila todas as análises das ferramentas especializadas em um documento JSON abrangente. Contém aprovação, big idea, pontuações e sugestões de melhoria.'
        },
        'rag': {
            title: '🗄️ RAG - Base de Conhecimento',
            description: 'Retrieval-Augmented Generation: Base de conhecimento especializada contendo metodologias de Todd Brown, melhores práticas de VSL e referências de alta conversão. Alimenta todas as ferramentas com informações contextuais.'
        },
        'think': {
            title: '🧠 THINK - Ferramenta de Raciocínio',
            description: 'Sistema de raciocínio avançado que permite às ferramentas processar informações complexas, fazer conexões lógicas e gerar insights profundos sobre o conteúdo do VSL.'
        }
    };

    // Add click event listeners to all cards
    cards.forEach(card => {
        card.addEventListener('click', function() {
            const element = this.getAttribute('data-element');
            showElementInfo(element);
            
            // Remove active class from all cards
            cards.forEach(c => c.classList.remove('active'));
            // Add active class to clicked card
            this.classList.add('active');
        });

        // Add hover effects
        card.addEventListener('mouseenter', function() {
            if (!this.classList.contains('active')) {
                this.style.transform = 'translateY(-4px)';
            }
        });

        card.addEventListener('mouseleave', function() {
            if (!this.classList.contains('active')) {
                this.style.transform = '';
            }
        });
    });

    // Simulate workflow button
    simulateBtn.addEventListener('click', function() {
        simulateWorkflow();
    });

    // Function to show element information
    function showElementInfo(element) {
        const info = infoMap[element];
        if (info) {
            infoTitle.textContent = info.title;
            infoDescription.textContent = info.description;
            
            // Animate info panel
            infoPanel.style.transform = 'scale(0.95)';
            setTimeout(() => {
                infoPanel.style.transform = 'scale(1)';
            }, 100);
        }
    }

    // Function to simulate workflow
    function simulateWorkflow() {
        const sequence = [
            { element: 'input', delay: 0 },
            { element: 'orchestrator', delay: 1000 },
            { element: 'tool2', delay: 2000 },
            { element: 'tool3', delay: 3000 },
            { element: 'tool4', delay: 4000 },
            { element: 'tool5', delay: 5000 },
            { element: 'output', delay: 6000 }
        ];

        // Disable button during simulation
        simulateBtn.disabled = true;
        simulateBtn.textContent = '⏳ Simulando...';

        // Reset all cards
        cards.forEach(card => {
            card.classList.remove('active', 'simulating');
        });

        // Execute sequence
        sequence.forEach(step => {
            setTimeout(() => {
                const card = document.querySelector(`[data-element="${step.element}"]`);
                if (card) {
                    // Remove previous active states
                    cards.forEach(c => c.classList.remove('active'));
                    
                    // Add simulating animation
                    card.classList.add('simulating');
                    
                    // Show info for current step
                    showElementInfo(step.element);
                    
                    // Add active state after animation
                    setTimeout(() => {
                        card.classList.remove('simulating');
                        card.classList.add('active');
                    }, 400);
                }
            }, step.delay);
        });

        // Re-enable button after simulation
        setTimeout(() => {
            simulateBtn.disabled = false;
            simulateBtn.textContent = '▶️ Simular Fluxo de Trabalho';
            
            // Show final summary
            infoTitle.textContent = '🎉 Simulação Concluída';
            infoDescription.textContent = 'O fluxo de trabalho foi executado com sucesso! O Clone Digital do Todd Brown processou o briefing VSL através de todas as ferramentas especializadas, gerando uma análise completa e detalhada.';
        }, 7000);
    }

    // Initialize with default info
    showElementInfo('input');
});

// Add some visual enhancements
document.addEventListener('DOMContentLoaded', function() {
    // Add smooth scrolling for better UX
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Add intersection observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe all cards for entrance animations
    const allCards = document.querySelectorAll('.card');
    allCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });

    // Stagger the animations
    allCards.forEach((card, index) => {
        setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
});