"use client"

import { AuthModal } from "@/components/auth/auth-modal"
import { LoginForm } from "@/components/auth/login-form"

export default function LoginPage() {
  return (
    <AuthModal title="Bienvenido" description="Gestión de Club de Balonmano" logo="🏐">
      <LoginForm />
    </AuthModal>
  )
}
