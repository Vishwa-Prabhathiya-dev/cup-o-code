import Link from 'next/link'
import SignupForm from '@/components/SignupForm'

export default function SignupPage() {

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-6 text-center">Sign Up</h1>
        <SignupForm />
        <p className="mt-4 text-center">
          Already have an account?{' '}
          <Link href="/" className="text-blue-500 hover:underline">Login</Link>
        </p>
      </div>
    </div>
  )
}

