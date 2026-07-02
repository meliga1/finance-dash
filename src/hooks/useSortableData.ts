import { useMemo, useState } from 'react'

export type SortDirection = 'asc' | 'desc'

export type SortValue = number | string

/** Mapa de chave de coluna → função que extrai o valor ordenável do item. */
export type SortAccessors<T> = Record<string, (item: T) => SortValue>

export type SortState = {
  key: string
  direction: SortDirection
}

export function useSortableData<T>(
  items: T[],
  accessors: SortAccessors<T>,
  initial: SortState,
) {
  const [sort, setSort] = useState<SortState>(initial)

  const sorted = useMemo(() => {
    const accessor = accessors[sort.key]
    if (!accessor) return items

    const copy = [...items]
    copy.sort((a, b) => {
      const aValue = accessor(a)
      const bValue = accessor(b)

      let comparison: number
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        comparison = aValue - bValue
      } else {
        comparison = String(aValue).localeCompare(String(bValue), 'pt-BR')
      }

      return sort.direction === 'asc' ? comparison : -comparison
    })

    return copy
  }, [items, accessors, sort])

  const toggleSort = (key: string) => {
    setSort((prev) =>
      prev.key === key
        ? { key, direction: prev.direction === 'asc' ? 'desc' : 'asc' }
        : { key, direction: 'asc' },
    )
  }

  return { sorted, sort, toggleSort }
}
