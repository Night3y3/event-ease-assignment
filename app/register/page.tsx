import { RegisterForm } from "@/components/register-form"
import { Header } from "@/components/header"

export default function RegisterPage() {
  return (
    <div className="flex flex-col min-h-screen w-full">
      <Header />
      <main className="flex-1 flex items-center justify-center p-4 w-full">
        <div className="w-full max-w-md">
          <RegisterForm />
        </div>
      </main>
    </div>
  )
}
