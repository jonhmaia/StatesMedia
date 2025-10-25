# 🧠 Conception — Arquitetura e Decisões Técnicas do Sistema de Agentes

**Metadados do Documento:**
- **Versão:** 1.2
- **Data de Atualização:** 2025-01-25
- **Autor:** StatesMedia Team
- **Tipo:** Documentação Técnica de Arquitetura

---

## 1. Escolha do LLM

O sistema utiliza dois modelos de linguagem principais: **GPT-5-mini** (modelo primário) e **GPT-4.1-mini** (fallback).

### GPT-5-mini (principal)

É o modelo padrão para a maioria das tarefas de raciocínio, geração e análise. Foi configurado com **reasoning effort = low**, garantindo **baixa latência**, **menor custo por requisição** e ótimo equilíbrio entre contexto e coerência textual.

Sua janela de contexto de **30.000 tokens** permite processar PDFs extensos sem fragmentação excessiva. Ele foi escolhido por oferecer o melhor **custo-benefício** entre profundidade analítica e tempo de resposta, sendo ideal para os agentes **Engenheiro de Big Idea**, **Estrategista de Otimização** e **Avaliador E5**.

### GPT-4.1-mini (fallback)

Atua como reserva automática quando há saturação de chamadas ou necessidade de dupla validação semântica. O modelo se destaca pelo balanceamento entre **custo, velocidade e qualidade de instrução**, oferecendo alta confiabilidade e respostas consistentes em fluxos críticos (como os agentes **Crítico de Aprovação** e **Orquestrador**).

Seu comportamento previsível e estável é essencial para manter a coerência entre as etapas de análise e síntese do JSON final.

Essa combinação de LLMs proporciona **redundância inteligente** e **otimização de custos**, mantendo o desempenho consistente mesmo em execuções paralelas no n8n.

---

## 2. Escolha da Base de Dados Vetorial

A base de conhecimento utiliza **Supabase com extensão pgvector**.

### Justificativas técnicas:

- **Integração nativa com PostgreSQL**, facilitando a execução de queries híbridas entre dados estruturados e embeddings vetoriais.
- Suporte à função **ai_match_documents**, que realiza busca semântica direta e eficiente, sem dependência de serviços externos.
- **Segurança reforçada via Row Level Security (RLS)** e autenticação nativa da Supabase.
- **Compatibilidade total com fluxos automatizados do n8n**, permitindo consultas SQL ou REST em tempo real.
- **Custos previsíveis e escalabilidade horizontal** — diferentemente de alternativas como Pinecone (custo variável) ou ChromaDB (persistência limitada).

---

## 3. Arquitetura Geral — Fluxo de Dados

O sistema adota uma **arquitetura multiagente orquestrada via n8n**, com fluxo linear e pontos de iteração entre os agentes cognitivos.

```
Usuário → Upload/Link PDF → Extração (n8n) → Vetorização (Supabase) → 
Agentes (GPT-5-mini / 4.1-mini) → Síntese JSON → Supabase
```

### Etapas Detalhadas

#### Recepção do briefing (PDF)
O arquivo é baixado via **HTTP** (se for link do Google Drive) ou enviado diretamente pela **interface**.
O nó **"Extract PDF"** converte o conteúdo em texto bruto e metadados (título, tópicos, sumário, etc.).

#### Pré-processamento
O texto é normalizado, tokenizado e dividido em blocos de até **30.000 tokens**, compatíveis com o limite do GPT-5-mini.
Os trechos são então vetorizados e armazenados na Supabase.

#### Distribuição entre Agentes
- **Orquestrador:** centraliza o fluxo, gerencia chamadas e consolida resultados.
- **Engenheiro de Big Idea:** identifica o conceito-núcleo e traduz a intenção estratégica.
- **Estrategista de Otimização:** refina estrutura, adiciona métricas e melhora legibilidade.
- **Crítico de Aprovação:** realiza a revisão técnica, coerência textual e aderência ao padrão.
- **Avaliador E5:** aplica a matriz de avaliação (Eficiência, Estilo, Estratégia, Estrutura e Espírito).

#### Consulta à Base Vetorial (RAG)
Cada agente consulta a Supabase via função **match_documents**, que retorna os trechos mais semanticamente relevantes.
Os resultados são inseridos no **prompt context** de cada agente, aprimorando precisão e contextualização.

#### Fusão dos Resultados
As respostas dos agentes são retornadas ao **Orquestrador**, que:
- Verifica coerência e sobreposição de ideias.
- Resolve divergências.
- Consolida tudo em um **JSON final padronizado** com campos:

```json
{
  "big_idea": "...",
  "otimizacao": "...",
  "critica": "...",
  "avaliacao_e5": "..."
}
```

O JSON é armazenado na Supabase e disponibilizado via API ou dashboard.

---

## 4. Stack Resumida

| Camada | Tecnologia | Função Principal |
|--------|------------|------------------|
| **Entrada** | HTTP / Google Drive API | Recepção do briefing |
| **Processamento** | n8n Extract PDF | Conversão de PDF em texto |
| **Vetorização** | Supabase + pgvector | Armazenamento semântico |
| **Agentes** | GPT-5-mini (low reasoning), GPT-4.1-mini (fallback) | Raciocínio e análise |
| **Orquestração** | n8n | Controle de fluxo entre agentes |
| **Persistência** | Supabase PostgreSQL | Armazenamento de resultados |
| **Saída** | JSON estruturado | Integração com painéis e relatórios |

---

## 5. Conclusão

A arquitetura privilegia **eficiência, resiliência e escalabilidade**.

O uso do **GPT-5-mini** como agente principal garante respostas rápidas e coerentes com baixo custo computacional, enquanto o **GPT-4.1-mini** oferece redundância e estabilidade em cenários críticos.

A integração com **Supabase** fornece um backend vetorial unificado, simplificando o RAG e permitindo rastreabilidade completa dos dados.

O resultado é um **ecossistema de agentes modular, auditável e economicamente otimizado**, ideal para aplicações de análise automatizada de documentos.
