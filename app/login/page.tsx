import { LoginForm } from "@/components/login-form"
import { Header } from "@/components/header"

export default function LoginPage() {
  return (
    <div className="flex flex-col min-h-screen w-full">
      <Header />
      <main className="flex-1 flex items-center justify-center p-4 w-full">
        <div className="w-full max-w-md">
          <LoginForm />
        </div>
      </main>
    </div>
  )
}
