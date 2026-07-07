export const newsKeys = {
  all: ['news'] as const,
  list: (limit: number) => [...newsKeys.all, 'list', limit] as const,
}
