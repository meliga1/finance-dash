import type { ReactNode } from 'react'
import type { Asset } from '@/features/assets/types'
import type { CurrencyCode } from '@/types/common'
import { cn } from '@/lib/cn'
import { formatCurrency, formatNumber, formatPercent } from '@/lib/formatters'
import { ChangeIndicator, Skeleton } from '@/components/ui'
import {
  useSortableData,
  type SortAccessors,
  type SortDirection,
} from '@/hooks/useSortableData'

type Align = 'left' | 'right'

type Column = {
  key: string
  label: string
  align: Align
  render: (asset: Asset, currency: CurrencyCode) => ReactNode
}

// Extração de valores ordenáveis — numéricos ordenam por número; "symbol" por texto.
const ACCESSORS: SortAccessors<Asset> = {
  symbol: (a) => a.symbol,
  quantity: (a) => a.quantity,
  currentPrice: (a) => a.currentPrice,
  totalValue: (a) => a.totalValue,
  change24h: (a) => a.change24h.percentage,
  allocation: (a) => a.allocation,
}

function VariationCell({ asset, currency }: { asset: Asset; currency: CurrencyCode }) {
  const { absolute, percentage } = asset.change24h
  const sign = absolute > 0 ? '+' : absolute < 0 ? '−' : ''

  return (
    <div className="flex flex-col items-end gap-0.5">
      <ChangeIndicator percent={percentage} size="sm" />
      <span className="text-caption text-text-muted">
        {sign}
        {formatCurrency(Math.abs(absolute), currency)}
      </span>
    </div>
  )
}

const COLUMNS: Column[] = [
  {
    key: 'symbol',
    label: 'Ativo',
    align: 'left',
    render: (asset) => (
      <div className="flex flex-col">
        <span className="font-medium text-text-primary">{asset.symbol}</span>
        <span className="text-caption text-text-muted">{asset.name}</span>
      </div>
    ),
  },
  {
    key: 'quantity',
    label: 'Quantidade',
    align: 'right',
    render: (asset) => formatNumber(asset.quantity),
  },
  {
    key: 'currentPrice',
    label: 'Preço atual',
    align: 'right',
    render: (asset, currency) => formatCurrency(asset.currentPrice, currency),
  },
  {
    key: 'totalValue',
    label: 'Valor total',
    align: 'right',
    render: (asset, currency) => (
      <span className="font-medium text-text-primary">
        {formatCurrency(asset.totalValue, currency)}
      </span>
    ),
  },
  {
    key: 'change24h',
    label: 'Variação 24h',
    align: 'right',
    render: (asset, currency) => <VariationCell asset={asset} currency={currency} />,
  },
  {
    key: 'allocation',
    label: 'Participação',
    align: 'right',
    render: (asset) => formatPercent(asset.allocation, { signed: false }),
  },
]

function SortArrow({ state }: { state: SortDirection | 'inactive' }) {
  return (
    <svg
      viewBox="0 0 12 12"
      fill="none"
      aria-hidden="true"
      className={cn(
        'size-3 shrink-0 transition-opacity',
        state === 'inactive'
          ? 'opacity-0 group-hover/sort:opacity-40'
          : 'text-accent-teal opacity-100',
      )}
    >
      <path
        d={state === 'desc' ? 'M6 8.5L3 5h6L6 8.5Z' : 'M6 3.5L9 7H3L6 3.5Z'}
        fill="currentColor"
      />
    </svg>
  )
}

const cellPadding = 'px-4 py-3.5 first:pl-5 last:pr-5'
const stickyFirst = 'sticky left-0 border-r border-border-subtle'

type SortHeaderProps = {
  column: Column
  active: boolean
  direction: SortDirection
  onSort: (key: string) => void
}

function SortHeader({ column, active, direction, onSort }: SortHeaderProps) {
  const isFirst = column.key === COLUMNS[0].key

  return (
    <th
      scope="col"
      aria-sort={active ? (direction === 'asc' ? 'ascending' : 'descending') : 'none'}
      className={cn(
        cellPadding,
        'bg-surface-raised text-overline uppercase text-text-muted',
        isFirst && cn(stickyFirst, 'z-20 bg-surface-raised'),
      )}
    >
      <button
        type="button"
        onClick={() => onSort(column.key)}
        className={cn(
          'group/sort flex w-full items-center gap-1 transition-colors hover:text-text-secondary',
          'focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-teal',
          column.align === 'right' ? 'justify-end' : 'justify-start',
        )}
      >
        <span>{column.label}</span>
        <SortArrow state={active ? direction : 'inactive'} />
      </button>
    </th>
  )
}

export type AssetsTableProps = {
  assets: Asset[]
  currency: CurrencyCode
}

export function AssetsTable({ assets, currency }: AssetsTableProps) {
  const { sorted, sort, toggleSort } = useSortableData(assets, ACCESSORS, {
    key: 'totalValue',
    direction: 'desc',
  })

  return (
    <div className="overflow-hidden rounded-card border border-border-subtle bg-surface shadow-card">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[720px] border-collapse text-body">
          <caption className="sr-only">Ativos da carteira</caption>
          <thead>
            <tr className="border-b border-border">
              {COLUMNS.map((column) => (
                <SortHeader
                  key={column.key}
                  column={column}
                  active={sort.key === column.key}
                  direction={sort.direction}
                  onSort={toggleSort}
                />
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted.map((asset) => (
              <tr
                key={asset.id}
                className="group border-b border-border-subtle transition-colors last:border-b-0 hover:bg-surface-raised"
              >
                {COLUMNS.map((column) => {
                  const isFirst = column.key === COLUMNS[0].key
                  return (
                    <td
                      key={column.key}
                      className={cn(
                        cellPadding,
                        column.align === 'right'
                          ? 'text-right tabular-nums text-text-secondary'
                          : 'text-left',
                        isFirst && cn(stickyFirst, 'z-10 bg-surface group-hover:bg-surface-raised'),
                      )}
                    >
                      {column.render(asset, currency)}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export function AssetsTableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="overflow-hidden rounded-card border border-border-subtle bg-surface shadow-card">
      <div className="border-b border-border px-5 py-3.5">
        <Skeleton variant="text" className="w-24" />
      </div>
      <div className="divide-y divide-border-subtle">
        {Array.from({ length: rows }).map((_, index) => (
          <div key={index} className="flex items-center justify-between gap-4 px-5 py-4">
            <div className="flex items-center gap-3">
              <Skeleton variant="circle" className="size-8" />
              <div className="space-y-1.5">
                <Skeleton variant="text" className="h-3.5 w-14" />
                <Skeleton variant="text" className="h-3 w-20" />
              </div>
            </div>
            <div className="hidden gap-10 sm:flex">
              <Skeleton variant="text" className="w-16" />
              <Skeleton variant="text" className="w-20" />
              <Skeleton variant="text" className="w-16" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
