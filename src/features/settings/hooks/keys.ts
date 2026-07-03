export const settingsKeys = {
  all: ['settings'] as const,
  bybit: () => [...settingsKeys.all, 'bybit'] as const,
}
