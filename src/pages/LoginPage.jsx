import { LoginForm } from "@/components/login-form";

function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-6 md:p-10">
      <div className="w-full max-w-md md:max-w-3xl">
        <LoginForm />
      </div>
    </div>
  )
}

export default LoginPage