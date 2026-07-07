import { useMemo, useState } from 'react'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { useLayout } from '@/components/layout/layout-context'
import { usePortfolioHistory } from '@/features/portfolio/hooks'
import { formatCurrency, formatCurrencyCompact } from '@/lib/formatters'
import { CHART_COLORS } from '@/lib/chartTheme'
import type { CurrencyCode } from '@/types/common'
import type { HistoryPeriod } from '@/features/portfolio/types'
import { PERIOD_OPTIONS, PERIOD_LIMIT, PERIOD_EYEBROW, formatPointLabel } from '@/features/portfolio/historyPeriod'
import { isErrorCode } from '@/services/http'
import { ConnectBybitPrompt } from '@/features/portfolio/components/ConnectBybitPrompt'
import { ChartFrame } from './ChartFrame'

function PeriodToggle({
  value,
  onChange,
}: {
  value: HistoryPeriod
  onChange: (period: HistoryPeriod) => void
}) {
  return (
    <div
      role="group"
      aria-label="Período do histórico"
      className="inline-flex rounded-card border border-border-subtle bg-surface-raised p-0.5"
    >
      {PERIOD_OPTIONS.map((option) => {
        const isActive = value === option.value

        return (
          <button
            key={option.value}
            type="button"
            aria-pressed={isActive}
            onClick={() => onChange(option.value)}
            className={[
              'rounded-[0.45rem] px-2.5 py-1 text-caption font-medium transition-colors',
              'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-teal',
              isActive
                ? 'bg-surface-overlay text-text-primary shadow-card'
                : 'text-text-muted hover:text-text-secondary',
            ].join(' ')}
          >
            {option.label}
          </button>
        )
      })}
    </div>
  )
}

type Point = {
  label: string
  value: number
}

function HistoryTooltip({
  active,
  payload,
  currency,
}: {
  active?: boolean
  payload?: Array<{ payload: Point }>
  currency: CurrencyCode
}) {
  if (!active || !payload?.length) return null
  const point = payload[0].payload

  return (
    <div
      className="rounded-card border px-3 py-2 text-caption shadow-elevated"
      style={{ backgroundColor: CHART_COLORS.tooltipBg, borderColor: CHART_COLORS.tooltipBorder }}
    >
      <p className="text-text-muted">{point.label}</p>
      <p className="mt-0.5 text-body font-semibold tabular-nums text-text-primary">
        {formatCurrency(point.value, currency)}
      </p>
    </div>
  )
}

const AXIS_TICK = { fontSize: 11, fill: CHART_COLORS.axis }

export function PortfolioHistoryChart({
  period: controlledPeriod,
  onPeriodChange,
}: {
  period?: HistoryPeriod
  onPeriodChange?: (period: HistoryPeriod) => void
} = {}) {
  const { currency } = useLayout()
  const [internalPeriod, setInternalPeriod] = useState<HistoryPeriod>('monthly')
  const period = controlledPeriod ?? internalPeriod
  const setPeriod = onPeriodChange ?? setInternalPeriod
  const { data, error, isPending, isError, refetch } = usePortfolioHistory(
    currency,
    period,
    PERIOD_LIMIT[period],
  )

  const points = useMemo<Point[]>(
    () =>
      (data ?? []).map((entry) => ({
        label: formatPointLabel(period, entry.date),
        value: entry.value,
      })),
    [data, period],
  )

  return (
    <ChartFrame
      title="Evolução do patrimônio"
      eyebrow={PERIOD_EYEBROW[period]}
      action={<PeriodToggle value={period} onChange={setPeriod} />}
      height={320}
      isPending={isPending}
      isError={isError}
      isEmpty={points.length === 0}
      notConfigured={isErrorCode(error, 'not_configured') ? <ConnectBybitPrompt /> : undefined}
      onRetry={() => refetch()}
      emptyTitle="Sem histórico disponível"
      emptyDescription="A evolução aparecerá aqui quando houver dados."
      errorDescription="Não foi possível carregar o histórico."
    >
      <div
        className="h-full"
        role="img"
        aria-label={`Evolução do patrimônio — ${PERIOD_EYEBROW[period]}`}
      >
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={points} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="portfolioArea" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={CHART_COLORS.area} stopOpacity={0.35} />
                <stop offset="100%" stopColor={CHART_COLORS.area} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              stroke={CHART_COLORS.grid}
              strokeDasharray="3 3"
              vertical={false}
            />
            <XAxis
              dataKey="label"
              tick={AXIS_TICK}
              tickLine={false}
              axisLine={{ stroke: CHART_COLORS.axisLine }}
              interval="preserveStartEnd"
              minTickGap={24}
            />
            <YAxis
              tick={AXIS_TICK}
              tickLine={false}
              axisLine={false}
              width={64}
              tickFormatter={(value: number) => formatCurrencyCompact(value, currency)}
            />
            <Tooltip
              content={<HistoryTooltip currency={currency} />}
              cursor={{ stroke: CHART_COLORS.axisLine, strokeWidth: 1 }}
              wrapperStyle={{ outline: 'none' }}
            />
            <Area
              type="monotone"
              dataKey="value"
              stroke={CHART_COLORS.area}
              strokeWidth={2}
              fill="url(#portfolioArea)"
              dot={false}
              activeDot={{ r: 4, strokeWidth: 0 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </ChartFrame>
  )
}
