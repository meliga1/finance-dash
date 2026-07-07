// Cores de gráfico centralizadas — valores hex (Recharts usa cor inline, não classe Tailwind).
// Mantidas em sincronia com os tokens `chart.*` do tailwind.config.js.

/** Paleta reutilizável para séries categóricas (pie, barras futuras, etc.). */
export const CHART_PALETTE = [
  '#2EC4B6', // teal
  '#C9A227', // gold
  '#6C8EBF', // periwinkle
  '#9B7EDE', // lavender
  '#E07A5F', // coral
  '#4FB0C6', // cyan
  '#D4A24E', // sand
  '#D07AA6', // rose
] as const

/**
 * Cor estável por ativo conhecido — preserva a identidade visual entre telas
 * (BTC sempre dourado, ETH sempre azul, etc.). Ativos novos caem no fallback.
 */
const ASSET_COLOR_BY_SYMBOL: Record<string, string> = {
  BTC: '#C9A227',
  ETH: '#6C8EBF',
  USDT: '#2EC4B6',
  SOL: '#9B7EDE',
  ADA: '#E07A5F',
}

export function getAssetColor(symbol: string, index: number): string {
  return ASSET_COLOR_BY_SYMBOL[symbol] ?? CHART_PALETTE[index % CHART_PALETTE.length]
}

/** Cores de chrome do gráfico (grid, eixos, tooltip) alinhadas ao tema escuro. */
export const CHART_COLORS = {
  grid: '#1E293B', // border-subtle
  axis: '#6B7A90', // text-muted
  axisLine: '#2D3A4F', // border
  tooltipBg: '#1A2332', // surface-raised
  tooltipBorder: '#2D3A4F', // border
  area: '#2EC4B6', // accent-teal
} as const
