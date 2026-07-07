import { useQuery } from '@tanstack/react-query'
import { fetchAvailableCoins } from '@/services/binance'

// Lista de moedas negociáveis na Binance, para a busca de "adicionar moeda" —
// muda raramente, então cacheia por 1h em vez de refetch a cada abertura.
export function useAvailableCoins() {
  return useQuery({
    queryKey: ['binance', 'available-coins'],
    queryFn: fetchAvailableCoins,
    staleTime: 60 * 60 * 1000,
  })
}
