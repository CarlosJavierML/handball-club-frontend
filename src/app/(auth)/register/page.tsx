"use client"

import { AuthModal } from "@/components/auth/auth-modal"
import { RegisterForm } from "@/components/auth/register-form"

export default function RegisterPage() {
  return (
    <AuthModal title="Crear Cuenta" description="Únete a nuestro sistema de gestión" logo="🏐">
      <RegisterForm />
    </AuthModal>
  )
}
