import { Link } from "react-router-dom"
import { Button } from "@/components/ui/button"

export default function NotFoundPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-950 px-4 text-white">
      <div className="max-w-lg text-center">
        <p className="text-sm font-medium text-blue-300">LoanAxis</p>
        <h1 className="mt-3 text-6xl font-bold">404</h1>
        <p className="mt-4 text-lg text-slate-300">
          The page you are looking for does not exist.
        </p>

        <Button asChild className="mt-6">
          <Link to="/">Back to home</Link>
        </Button>
      </div>
    </main>
  )
}