# LOARA 2026 - Planejamento Estratégico

## Contexto do Projeto

Este é um dashboard de planejamento estratégico para a área de Parcerias da LOARA para 2026. O objetivo é criar um front-end bonito e interativo que lê dados de um arquivo Excel/JSON e apresenta para gestores.

## Arquitetura Definida

```
├── data.json          # Dados extraídos do Excel (fonte de verdade)
├── index.html         # Entry point
├── src/
│   ├── components/    # Componentes React
│   │   ├── Header.jsx
│   │   ├── Navigation.jsx
│   │   ├── StatCard.jsx
│   │   └── tabs/
│   │       ├── TabSumario.jsx
│   │       ├── TabCenarios.jsx
│   │       ├── TabMetas.jsx
│   │       ├── TabDiagnostico.jsx
│   │       ├── TabCompensacao.jsx
│   │       ├── TabProcessos.jsx
│   │       ├── TabRiscos.jsx
│   │       ├── TabKPIs.jsx
│   │       ├── TabRoadmap.jsx
│   │       └── TabGovernanca.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── package.json
└── vite.config.js     # Para build e deploy
```

## Stack Tecnológica

- **React 18** - Framework principal
- **Vite** - Build tool (rápido, bom para GitHub Pages)
- **Tailwind CSS** - Estilização
- **Recharts** - Gráficos
- **Lucide React** - Ícones

## Design System

### Cores Principais
```css
--loara-50: #f0f4ff;
--loara-500: #6370f1;
--loara-600: #4f4de5;
--loara-900: #313381;
--loara-950: #1e1d4b;

--emerald: #10B981;  /* Positivo/Crescimento */
--amber: #F59E0B;    /* Atenção/Ouro */
--rose: #F43F5E;     /* Negativo/Risco */
--sky: #0EA5E9;      /* Info */
```

### Fonte
- **Plus Jakarta Sans** - Display e corpo

### Componentes de Design
- Cards com `rounded-2xl`, `shadow-sm`, `border border-slate-100`
- Hover com `card-hover` (translateY -4px + shadow)
- Gradientes para headers
- Glass effect para navegação sticky

## Estrutura de Dados (data.json)

```javascript
{
  "textos": { /* Todos os textos editáveis do sistema */ },
  "valores_base": {
    "baseline_2025": { carteira_inicial, indicacoes, contratos, captacao, receita, ... },
    "premissas_2026": { churn_meta, taxa_conversao, ticket_medio, ... }
  },
  "metas_mensais": [
    { mes, carteira_inicio, novos, churn, carteira_fim, indicacoes, contratos, operacoes, captacao, receita }
  ],
  "totais_2026": { carteira_final, novos, churn, indicacoes, contratos, operacoes, captacao, receita },
  "metas_trimestrais": [ { trimestre, periodo, foco, novos, churn, indicacoes, contratos, receita } ],
  "cenarios": {
    "conservador": { ... },
    "moderado": { ... },
    "agressivo": { ... }
  },
  "crescimento": { carteira, indicacoes, contratos, captacao, receita },
  "desafios": [ { id, title, description, impact, quantified_impact, solutions } ],
  "oportunidades": [ { id, title, potential_impact, investment, timeline } ],
  "riscos": [ { id, title, probability, impact, mitigation, contingency } ],
  "kpis": [ { nome, formula, meta, frequencia } ],
  "processos": {
    "prospeccao": [ { passo, acao, ferramenta, tempo } ],
    "onboarding": [ { dia, atividade, responsavel } ],
    "scoring": [ { criterio, peso, pontos_0, pontos_10 } ]
  },
  "governanca": {
    "foruns": [ { nome, participantes, frequencia, duracao, objetivo } ],
    "calendario_mensal": [ { dia, atividade, responsavel } ]
  },
  "roadmap": [ { quarter, periodo, foco, meta_novos, atividades: [...] } ],
  "gerentes": {
    "matheus": { nome, cargo, carteira_2025, carteira_2026_meta, metas_2026, compensacao },
    "viviane": { ... }
  },
  "diagnostico": {
    "periodo": { inicio, fim },
    "resumo": { total_parceiros, parceiros_ativos, parceiros_ouro, parceiros_prata, parceiros_bronze, ... },
    "por_status": { "Ativado": N, "Desativado": N, ... },
    "por_tipo": { "Ouro": N, "Prata": N, "Bronze": N }
  }
}
```

## Funcionalidades por Tab

### 1. Sumário
- Objetivo estratégico (card destacado)
- 4 KPIs principais com trend
- Comparativo Baseline 2025 vs Meta 2026 vs Crescimento
- Gráfico de evolução da carteira (AreaChart)
- Cards de Desafios e Oportunidades

### 2. Cenários
- 3 cards lado a lado (Conservador, Moderado ⭐, Agressivo)
- Cada um com métricas e barra de probabilidade de sucesso
- Tabela comparativa detalhada

### 3. Metas
- 4 cards trimestrais coloridos
- Gráfico ComposedChart (barras novos/churn + linha carteira)
- Tabela mensal completa com totais

### 4. Diagnóstico
- KPIs da carteira atual
- PieChart por categoria (Ouro/Prata/Bronze)
- Barras de progresso por status

### 5. Compensação
- Cards por gerente com metas e compensação
- Tabela de estrutura de comissões

### 6. Processos
- Fluxo de prospecção (passos)
- Grid de onboarding (30 dias)
- Tabela de scoring

### 7. Riscos
- Cards com borda lateral colorida por nível
- Score calculado (prob × impacto / 100)
- Níveis: CRÍTICO (≥3), ALTO (≥2), MÉDIO (<2)

### 8. KPIs
- Grid de cards com nome, fórmula e meta

### 9. Roadmap
- Accordion/cards por trimestre
- Tabela de atividades por semana

### 10. Governança
- Cards de fóruns
- Lista de calendário mensal

## Deploy

O projeto deve fazer deploy no GitHub Pages:

```bash
# No package.json
"scripts": {
  "dev": "vite",
  "build": "vite build",
  "preview": "vite preview"
}

# vite.config.js
export default {
  base: '/loara-planejamento-2026/'  # Nome do repositório
}
```

## Próximos Passos

1. Inicializar projeto com Vite + React
2. Configurar Tailwind
3. Criar componentes base (Header, Navigation, StatCard)
4. Implementar cada tab como componente separado
5. Integrar gráficos com Recharts
6. Testar responsividade
7. Deploy no GitHub Pages

## Arquivos de Referência

- `data.json` - Dados completos já extraídos do Excel
- `planejamento_loara_2026_v2.xlsx` - Excel fonte (em /mnt/user-data/uploads ou local)
