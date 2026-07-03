# finance-dash

Painel de investimentos com preços reais (Binance), câmbio real (Frankfurter)
e saldo real de carteira (Bybit, Unified Trading Account).

## Setup

1. Instale as dependências do front-end (raiz do repo) e do back-end:
   ```
   npm install
   cd server && npm install && cd ..
   ```
2. Crie uma API key na Bybit (Account & Security → API Management →
   System-generated API Keys) com permissão **somente leitura** — deixe
   desmarcado Spot/Derivatives Trading, Withdrawal e Transfer. É uma key de
   **mainnet** (`api.bybit.com`), já que testnet não reflete saldo real.
3. Copie `server/.env.example` para `server/.env` e preencha
   `BYBIT_API_KEY`/`BYBIT_API_SECRET` com os valores gerados. Esse arquivo
   nunca é commitado.
4. Rode tudo com:
   ```
   npm run dev:all
   ```
   (ou, em dois terminais separados: `npm run dev` na raiz e
   `npm --prefix server run dev`).
5. Acesse `http://localhost:5173`.
