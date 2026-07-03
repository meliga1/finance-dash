import { useMemo } from 'react'
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { useLayout } from '@/components/layout/layout-context'
import { useAssets } from '@/features/assets/hooks'
import { formatCurrency, formatPercent } from '@/lib/formatters'
import { getAssetColor, CHART_COLORS } from '@/lib/chartTheme'
import type { CurrencyCode } from '@/types/common'
import { ChartFrame } from './ChartFrame'

type Slice = {
  symbol: string
  name: string
  allocation: number
  value: number
  color: string
}

function AllocationTooltip({
  active,
  payload,
  currency,
}: {
  active?: boolean
  payload?: Array<{ payload: Slice }>
  currency: CurrencyCode
}) {
  if (!active || !payload?.length) return null
  const slice = payload[0].payload

  return (
    <div
      className="rounded-card border px-3 py-2 text-caption shadow-elevated"
      style={{ backgroundColor: CHART_COLORS.tooltipBg, borderColor: CHART_COLORS.tooltipBorder }}
    >
      <div className="flex items-center gap-2">
        <span className="size-2.5 rounded-full" style={{ backgroundColor: slice.color }} />
        <span className="font-medium text-text-primary">{slice.symbol}</span>
        <span className="text-text-muted">{slice.name}</span>
      </div>
      <div className="mt-1 flex items-baseline gap-2 tabular-nums">
        <span className="text-body font-semibold text-text-primary">
          {formatPercent(slice.allocation, { signed: false })}
        </span>
        <span className="text-text-secondary">{formatCurrency(slice.value, currency)}</span>
      </div>
    </div>
  )
}

function Legend({ slices }: { slices: Slice[] }) {
  return (
    <ul className="mt-4 flex flex-wrap gap-x-4 gap-y-2">
      {slices.map((slice) => (
        <li key={slice.symbol} className="flex items-center gap-2 text-caption">
          <span
            aria-hidden="true"
            className="size-2.5 shrink-0 rounded-full"
            style={{ backgroundColor: slice.color }}
          />
          <span className="font-medium text-text-primary">{slice.symbol}</span>
          <span className="tabular-nums text-text-secondary">
            {formatPercent(slice.allocation, { signed: false })}
          </span>
        </li>
      ))}
    </ul>
  )
}

export function AllocationPieChart() {
  const { currency } = useLayout()
  const { data, isPending, isError, refetch } = useAssets(currency)

  const slices = useMemo<Slice[]>(
    () =>
      (data ?? []).map((asset, index) => ({
        symbol: asset.symbol,
        name: asset.name,
        allocation: asset.allocation,
        value: asset.totalValue,
        color: getAssetColor(asset.symbol, index),
      })),
    [data],
  )

  const total = useMemo(
    () => slices.reduce((sum, slice) => sum + slice.value, 0),
    [slices],
  )

  return (
    <ChartFrame
      title="Distribuição da carteira"
      eyebrow="Alocação"
      height={240}
      isPending={isPending}
      isError={isError}
      isEmpty={slices.length === 0}
      onRetry={() => refetch()}
      emptyTitle="Nenhum ativo para distribuir"
      emptyDescription="Adicione posições para ver a alocação da carteira."
      errorDescription="Não foi possível carregar a alocação."
      footer={<Legend slices={slices} />}
    >
      <div
        className="relative h-full"
        role="img"
        aria-label={`Distribuição da carteira entre ${slices.length} ativos`}
      >
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={slices}
              dataKey="allocation"
              nameKey="symbol"
              innerRadius="62%"
              outerRadius="92%"
              paddingAngle={2}
              stroke="none"
            >
              {slices.map((slice) => (
                <Cell key={slice.symbol} fill={slice.color} />
              ))}
            </Pie>
            <Tooltip
              content={<AllocationTooltip currency={currency} />}
              wrapperStyle={{ outline: 'none' }}
            />
          </PieChart>
        </ResponsiveContainer>

        <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-overline uppercase text-text-muted">Total</span>
          <span className="text-title tabular-nums text-text-primary">
            {formatCurrency(total, currency)}
          </span>
        </div>
      </div>
    </ChartFrame>
  )
}


