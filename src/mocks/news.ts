import type { NewsItem } from '@/features/news/types'

// Ordenadas da mais recente para a mais antiga.
const NEWS: NewsItem[] = [
  {
    id: 'news-001',
    title: 'Bitcoin supera resistência e renova máxima mensal',
    summary:
      'O ativo apresentou valorização impulsionada por fluxo institucional e pela expectativa de corte de juros nos EUA.',
    source: 'MarketWire',
    url: 'https://example.com/noticias/bitcoin-maxima-mensal',
    publishedAt: '2026-07-02T13:45:00Z',
  },
  {
    id: 'news-002',
    title: 'Ethereum avança com atualização que reduz custos de rede',
    summary:
      'A nova versão do protocolo promete taxas menores para contratos inteligentes, atraindo desenvolvedores de volta ao ecossistema.',
    source: 'CriptoFato',
    url: 'https://example.com/noticias/ethereum-taxas-menores',
    publishedAt: '2026-07-01T18:20:00Z',
  },
  {
    id: 'news-003',
    title: 'Dólar recua e alivia pressão sobre carteiras em cripto no Brasil',
    summary:
      'A queda da moeda americana frente ao real melhora o retorno de investidores locais expostos a ativos cotados em dólar.',
    source: 'Valor Cripto',
    url: 'https://example.com/noticias/dolar-recua-cripto',
    publishedAt: '2026-06-30T11:05:00Z',
  },
  {
    id: 'news-004',
    title: 'Solana lidera ganhos entre as principais altcoins na semana',
    summary:
      'Volume recorde em aplicações descentralizadas impulsiona o token, que acumula alta de dois dígitos nos últimos sete dias.',
    source: 'BlockDaily',
    url: 'https://example.com/noticias/solana-lidera-ganhos',
    publishedAt: '2026-06-28T09:30:00Z',
  },
  {
    id: 'news-005',
    title: 'Stablecoins ganham espaço como reserva de valor em meio à volatilidade',
    summary:
      'Investidores aumentam a alocação em stablecoins para proteger ganhos sem sair do ecossistema cripto.',
    source: 'MarketWire',
    url: 'https://example.com/noticias/stablecoins-reserva-valor',
    publishedAt: '2026-06-27T15:10:00Z',
  },
]

export function getNewsMock(limit: number): NewsItem[] {
  return NEWS.slice(0, limit)
}
