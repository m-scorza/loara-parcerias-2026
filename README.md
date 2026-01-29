# 📊 LOARA 2026 - Planejamento Estratégico

**Dashboard interativo para apresentação do Planejamento Estratégico da Área de Parcerias LOARA 2026.**

![Versão](https://img.shields.io/badge/versão-4.0-blue)
![Status](https://img.shields.io/badge/status-produção-green)

## 🚀 Acesso Rápido

**🔗 [Acessar Dashboard](https://seu-usuario.github.io/loara-planejamento-2026/)**

## 📋 Funcionalidades

- **📊 Sumário Executivo** - Visão geral com KPIs principais e crescimento projetado
- **🎯 Análise de Cenários** - Comparativo Conservador/Moderado/Agressivo
- **📅 Metas** - Projeções mensais e trimestrais detalhadas
- **🔍 Diagnóstico** - Análise da carteira atual de parceiros
- **⚠️ Riscos** - Matriz de riscos com mitigações
- **📉 KPIs** - Indicadores de performance
- **💰 Compensação** - Modelo de remuneração dos gerentes
- **⚙️ Processos** - Fluxos de prospecção, onboarding e scoring
- **🏛️ Governança** - Fóruns e calendário mensal

## 🛠️ Tecnologias

- React 18
- Tailwind CSS
- Recharts (gráficos)
- GitHub Pages (hospedagem)

## 📁 Estrutura

```
loara-planejamento-2026/
├── index.html      # Dashboard principal (React + Tailwind)
├── data.json       # Fonte de dados (editável)
└── README.md       # Este arquivo
```

## ✏️ Como Editar os Dados

1. Abra o arquivo `data.json`
2. Edite os valores desejados
3. Faça commit e push
4. O GitHub Pages atualiza automaticamente

### Principais seções do data.json:

```json
{
  "valores_base": {
    "baseline_2025": { ... },    // Resultados de 2025
    "premissas_2026": { ... }    // Premissas do cenário
  },
  "metas_mensais": [ ... ],      // Metas mês a mês
  "cenarios": { ... },           // 3 cenários estratégicos
  "riscos": [ ... ],             // Matriz de riscos
  "kpis": [ ... ],               // Indicadores
  ...
}
```

## 🚀 Deploy no GitHub Pages

1. Crie um repositório no GitHub
2. Faça upload dos arquivos (`index.html`, `data.json`, `README.md`)
3. Vá em **Settings** > **Pages**
4. Em **Source**, selecione `main` branch
5. Clique em **Save**
6. Aguarde alguns minutos e acesse o link gerado!

## 📊 Fonte de Dados Alternativa (Excel)

O dashboard também pode ser alimentado pelo Excel esqueleto disponível no projeto. 
Para isso, exporte o Excel para JSON mantendo a mesma estrutura do `data.json`.

---

**Documento Confidencial - Uso Interno**  
LOARA © 2026
