import type { ReactNode } from "react"
import { Card, CardContent } from "@/components/ui/card"

interface AuthModalProps {
  title: string
  description?: string
  children: ReactNode
  logo?: string
}

export function AuthModal({ title, description, children, logo }: AuthModalProps) {
  return (
    <div className="w-full max-w-md mx-auto">
      {/* Logo del club */}
      {logo && (
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 mb-4">
            <span className="text-2xl">{logo}</span>
          </div>
        </div>
      )}

      {/* Modal Card */}
      <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-sm">
        <CardContent className="pt-8">
          {/* Encabezado */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
            {description && <p className="text-gray-600 text-sm">{description}</p>}
          </div>

          {/* Contenido */}
          {children}
        </CardContent>
      </Card>

      {/* Footer note */}
      <div className="text-center mt-6 text-white/80 text-xs">Sistema de Gestión - Club de Balonmano</div>
    </div>
  )
}
