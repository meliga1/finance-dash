import { useMatches } from 'react-router-dom'

type RouteHandle = {
  title?: string
}

export function usePageTitle() {
  const matches = useMatches()

  for (let index = matches.length - 1; index >= 0; index -= 1) {
    const handle = matches[index].handle as RouteHandle | undefined
    if (handle?.title) return handle.title
  }

  return 'Finance Dash'
}
