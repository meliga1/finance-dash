# finance-dash

Painel de investimentos com preços reais (Binance), câmbio real (Frankfurter)
e saldo real de carteira (Bybit, Unified Trading Account).

## Setup

1. Instale as dependências do front-end (raiz do repo) e do back-end:
   ```
   npm install
   cd server && npm install && cd ..
   ```
2. Copie os dois arquivos de ambiente (nenhum dos dois é commitado):
   ```
   cp .env.example .env
   cp server/.env.example server/.env
   ```
   O `.env` da raiz é o que diz ao front-end onde está o back-end
   (`http://localhost:3333/api`) — sem ele o app mostra "Não foi possível
   conectar".
3. Rode tudo com:
   ```
   npm run dev:all
   ```
   (ou, em dois terminais separados: `npm run dev` na raiz e
   `npm --prefix server run dev`).
4. Acesse `http://localhost:5173`, crie sua conta na tela de setup e, uma
   vez logado, vá em **Configurações** para cadastrar sua API key da Bybit
   (Account & Security → API Management → System-generated API Keys,
   permissão **somente leitura**, sem Spot/Derivatives Trading, Withdrawal
   ou Transfer marcados — key de **mainnet**, já que testnet não reflete
   saldo real). A key fica criptografada em `server/data/app.db`, nunca em
   texto puro num arquivo.
