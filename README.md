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

# 🧠 Documentação de Engenharia de Prompt — Sistema Todd Brown AI Framework

## 📘 1. Visão Geral

O **Todd Brown AI Framework** é um sistema multiagente desenvolvido para analisar, avaliar e otimizar campanhas de VSLs (Video Sales Letters) com base na metodologia original de **Todd Brown**.  
Cada agente representa uma faceta específica do raciocínio estratégico do autor — e todos compartilham uma mesma engenharia de prompt cognitiva.  

Os quatro agentes principais são:

- 🧩 **Crítico de Aprovação** → Valida estrutura e estratégia conforme o princípio 75/25 e frameworks de fundação.  
- 💡 **Engenheiro de Big Idea** → Extrai, disseca e melhora a Grande Ideia de Marketing (BMI).  
- 📊 **Avaliador E5** → Mede e justifica a eficácia de cada bloco da VSL (Lead, História, Mecanismo, Oferta).  
- ⚙️ **Estrategista de Otimização** → Sintetiza as análises e propõe ajustes para conversão máxima.

Todos foram construídos sobre o mesmo núcleo de engenharia: **Cognitive Protocol Prompting**, combinando raciocínio controlado, recuperação semântica (RAG) e saídas determinísticas em JSON.

---

## ⚙️ 2. Paradigma de Engenharia de Prompt

A arquitetura segue o modelo **Cognitive Protocol Prompting**, no qual cada agente é instruído não apenas sobre *o que fazer*, mas **como pensar passo a passo**.  
Em vez de respostas improvisadas, os prompts impõem uma sequência lógica de raciocínio, baseada em três princípios:

1. **RAG Anchoring** — toda decisão é embasada em uma fonte real (“Essência Metodológica de Todd Brown para VSLs.docx”).  
2. **Chain of Thought Controlado** — o raciocínio interno é explicitamente registrado com a ferramenta `think_tool()`.  
3. **Saída Determinística** — todos os agentes retornam JSON padronizado, auditável e legível por máquina.

Esse paradigma cria um comportamento cognitivo coerente e previsível, transformando modelos de linguagem em **avaliadores estratégicos explicáveis**.

---

## 🧩 3. Pipeline Cognitivo Compartilhado

Todos os agentes seguem um mesmo fluxo de raciocínio, independentemente da tarefa:

| Etapa | Descrição | Ferramenta |
|-------|------------|-------------|
| **1. Entrada** | Recebe o briefing completo da VSL. | — |
| **2. Recuperação de Princípios** | Busca conceitos e frameworks relevantes na base vetorial. | `fonte()` |
| **3. Análise Cognitiva** | Compara briefing com princípios e estrutura ideal. | `think_tool()` |
| **4. Síntese Estratégica** | Produz decisão, avaliação ou plano de melhoria. | `think_tool()` |
| **5. Saída Padronizada** | Retorna JSON estruturado (decisão, notas, justificativas). | — |

Essa estrutura garante que todos os agentes “pensem do mesmo jeito” — e que suas respostas possam ser integradas automaticamente em um pipeline analítico.

---

## 🧠 4. Função e Importância da `think_tool()`

A **`think_tool()`** é o coração cognitivo do sistema.  
Ela obriga o modelo a **registrar o raciocínio antes de gerar a resposta**, garantindo transparência e coerência.

### ✳️ Funções Principais:

1. **Forçar Raciocínio Sequencial:**  
   Nenhuma conclusão é permitida sem que o modelo explique o passo anterior.

2. **Simular Pensamento Crítico:**  
   Cada agente age como um especialista que pensa, compara e decide com base em critérios claros.

3. **Evitar Alucinação:**  
   O uso conjunto da `think_tool()` com a `fonte()` obriga a IA a citar princípios reais da base, reduzindo invenções.

4. **Rastreabilidade:**  
   Permite auditar o “rastro mental” do modelo — crucial para avaliar consistência em execuções múltiplas.

5. **Reprodutibilidade:**  
   O mesmo input gera o mesmo raciocínio e resultado, garantindo estabilidade e confiabilidade em escala.

> 🔍 Em termos técnicos, a `think_tool()` converte raciocínio implícito em **razão auditável**, transformando o LLM em um agente de decisão explicável.

---

## 📚 5. Função da `fonte()` (Base de Conhecimento RAG)

A ferramenta **`fonte()`** conecta todos os agentes à base vetorial construída a partir do documento  
**“Essência Metodológica de Todd Brown para VSLs.docx”**, elaborado via **Gemini Deep Research**.  

Essa base contém princípios fundamentais, frameworks (E5, 75/25, Big Idea, Unique Mechanism), armadilhas comuns e exemplos anotados.  
Ela é estruturada em chunks semânticos com `metadata JSONB` contendo campos como:

- `category` (ex: BIG_IDEA, FUNDAMENTOS, ESTRUTURA_VSL)  
- `subcategory` (ex: lead, historia, mecanismo, oferta)  
- `concept` (ex: principio_75_25, mecanismo_integrado, armadilha_commodity)  
- `negative_example` (ex: true para erros e falhas)  

### Exemplo de chamada:
```bash
fonte(query="Função e critérios de um Lead eficaz em VSL", filter={"category": "ESTRUTURA_VSL"})
A fonte() garante consistência epistemológica — toda resposta é ancorada em conhecimento real e verificável.

🧱 6. Saídas Estruturadas e Interoperáveis
Os quatro agentes retornam respostas 100% estruturadas em JSON, ideais para ingestão por ferramentas como n8n, Supabase, Bubble e Retool.

Agente	Estrutura de Saída
🧩 Crítico de Aprovação	{ "todd_brown_approval": { "approved": bool, "framework_correct": bool, "justification": str } }
💡 Engenheiro de Big Idea	{ "extracted_idea": str, "improvements": [ { "point": str, "justification": str } × 5 ] }
📊 Avaliador E5	[ { "section": str, "score": int, "justification": str } × 4 ]
⚙️ Estrategista de Otimização	{ "optimization_plan": [ { "aspect": str, "action": str, "rationale": str } × n ] }

Esse formato facilita comparações, rankings, dashboards e visualizações em BI.

🧬 7. Benefícios da Engenharia Unificada
Benefício	Descrição
Coerência entre agentes	Todos compartilham o mesmo protocolo cognitivo e base RAG.
Escalabilidade	Pode processar dezenas de campanhas simultaneamente.
Auditabilidade total	Cada decisão tem registro de raciocínio via think_tool().
Reprodutibilidade	Saídas determinísticas sob mesmas condições de entrada.
Transparência e explicabilidade	O raciocínio é exposto e pode ser revisado humanamente.
Redução de custo	Modelos pequenos (GPT-5 mini, GPT-4.1 mini) garantem eficiência sem perder rigor.

⚙️ 8. Especificações Técnicas
Parâmetro	Valor
Paradigma de Prompt	Cognitive Protocol Prompting
Modelo Principal	GPT-5 mini (Reasoning Effort: Low)
Fallback	GPT-4.1 mini
Janela de Contexto	~30 000 tokens
Base RAG	“Essência Metodológica de Todd Brown para VSLs.docx” (Gemini Deep Research)
Ferramentas Cognitivas	think_tool() e fonte()
Linguagem	Português do Brasil
Saída	JSON estruturado e determinístico
Compatibilidade	n8n • Supabase • Bubble • Retool • Data Studio

💡 9. Conclusão
A arquitetura de engenharia de prompt dos quatro agentes Todd Brown é um exemplo de IA cognitiva aplicada a copywriting estratégico.
Cada agente pensa, consulta e decide como um especialista humano — mas com rastreabilidade e consistência algorítmica.

A combinação de think_tool() e fonte() cria um equilíbrio perfeito entre raciocínio e referência:
a primeira garante pensamento lógico e explicável; a segunda garante fundamentação real nos princípios da metodologia.

🔍 Em suma, o sistema Todd Brown AI transforma LLMs em avaliadores estratégicos explicáveis, capazes de raciocinar com base em frameworks e entregar análises estruturadas, confiáveis e auditáveis — elevando o nível da automação em marketing de performance.