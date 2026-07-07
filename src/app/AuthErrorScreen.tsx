import { Card } from '@/components/ui'
import { ErrorState } from '@/components/ui'

export function AuthErrorScreen({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-canvas px-4">
      <Card className="w-full max-w-sm" padding="lg">
        <ErrorState
          title="Não foi possível conectar"
          description="Verifique se o back-end está rodando e tente novamente."
          onRetry={onRetry}
        />
      </Card>
    </div>
  )
}
