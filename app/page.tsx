import Login from "./login/page"
import Link from 'next/link'

export default async function Home() {

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-8">Coffee Mood</h1>
      <Login />
      <p className="mt-4 text-center">
        Don't have an account?{' '}
        <Link href="/signup" className="text-blue-500 hover:underline">Sign up</Link>
      </p>
    </main>
  )
}