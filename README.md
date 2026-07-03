# Finance Dash

Painel de investimentos/cripto — front-end. Interface para acompanhar patrimônio,
carteira de ativos, evolução mensal e notícias de mercado.

> O front consome um **back-end próprio**. Ele **nunca** chama APIs de corretora
> diretamente nem manipula chaves/segredos — todo dado sensível vem do back-end.

## Stack

React + Vite + TypeScript · Tailwind CSS · React Router · TanStack Query · Recharts.

## Como rodar

```bash
npm install        # instala as dependências
cp .env.example .env   # cria o .env local (ajuste a URL se necessário)
npm run dev        # sobe o servidor de desenvolvimento (Vite)
```

Outros scripts:

```bash
npm run build      # type-check + build de produção
npm run preview    # serve o build localmente
npm run lint       # ESLint
```

## Variável de ambiente

| Variável | Obrigatória | Exemplo (dev) | Descrição |
|----------|-------------|---------------|-----------|
| `VITE_API_URL` | sim | `http://localhost:3333/api` | URL base do back-end próprio |

O `.env` não é versionado. Nunca coloque chaves de corretora ou segredos aqui — o
front não guarda credenciais.

## Estrutura de pastas (por features)

```
src/
├── app/            # bootstrap: router, providers (QueryClient), navegação
├── components/
│   ├── ui/         # primitivos: Card, StatCard, Button, Badge, Skeleton,
│   │               #   ChangeIndicator, EmptyState, ErrorState
│   ├── layout/     # AppLayout, Sidebar, Topbar (shell responsivo)
│   ├── charts/     # AllocationPieChart, PortfolioHistoryChart, ChartFrame
│   └── tables/     # AssetsTable
├── features/       # domínios isolados (portfolio, assets, news)
│   └── <feature>/
│       ├── components/  # componentes de domínio
│       ├── hooks/       # hooks TanStack Query (+ queryKeys)
│       ├── services/    # acesso a dados (mock hoje, HTTP amanhã)
│       └── types.ts     # tipos do contrato
├── hooks/          # hooks genéricos (useMediaQuery, useSortableData, ...)
├── lib/            # formatadores (pt-BR), cn, chartTheme
├── mocks/          # dados mockados por domínio (fase atual)
├── services/       # http.ts — cliente HTTP central
├── styles/         # CSS base (Tailwind)
└── types/          # tipos compartilhados (CurrencyCode, PriceChange)
```

### Camada de dados

Os componentes **nunca** importam mock ou service direto — só hooks
(`usePortfolioSummary`, `useAssets`, `usePortfolioHistory`, `useNews`). Cada hook
chama um service; hoje o service retorna mock, amanhã fará `http<T>()`. Trocar a
origem do dado é editar só o service — hook e componente ficam intactos.

## Contrato de API

O formato de todos os dados (endpoints, request/response, tipos) é definido em
**`API_CONTRACT.md`** — o documento compartilhado entre front e back-end e a
**fonte da verdade**. As interfaces TypeScript em `src/features/*/types.ts` e
`src/types/common.ts` espelham exatamente a seção "Contrato de tipos" desse
documento. Qualquer mudança de formato exige acordo entre a dupla e atualização
nos dois lados.

Endpoints do MVP:

| Método | Endpoint | Hook | Retorno |
|--------|----------|------|---------|
| GET | `/portfolio/summary?currency=` | `usePortfolioSummary` | `PortfolioSummary` |
| GET | `/assets?currency=` | `useAssets` | `{ assets: Asset[] }` |
| GET | `/portfolio/history?currency=&months=` | `usePortfolioHistory` | `{ history: PortfolioHistoryPoint[] }` |
| GET | `/news?limit=` | `useNews` | `{ news: NewsItem[] }` |

Erros seguem o envelope `{ error: { code, message } }`, normalizado pelo cliente
HTTP (`src/services/http.ts`) e tratado pelos hooks via TanStack Query.

## Migração mock → API

Migração **gradual, um service por vez**. O molde está em
`src/features/assets/services/assetsService.ts` (versão real comentada ao lado do
mock). Fluxo: ativar a versão HTTP de um service, testar a tela correspondente,
e só então seguir para o próximo — os demais permanecem em mock enquanto isso.
