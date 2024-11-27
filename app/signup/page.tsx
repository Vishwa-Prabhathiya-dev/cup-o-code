import Link from 'next/link'
import SignupForm from '@/components/SignupForm'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import Image from 'next/image'

export default function SignupPage() {

  return (
    <>
      <div className="flex justify-center p-4 lg:hidden">
        <Image
          src="https://wiley-my.sharepoint.com/personal/vpamugodar_wiley_com/Documents/Hackathon%20Images/logo.png"
          alt="Brew Your Mood"
          width={100}
          height={100}
          className="h-16 w-auto"
          unoptimized={true} />
      </div>
      <div className="flex min-h-screen flex-col lg:flex-row">
        <div className="relative hidden w-full lg:block lg:w-1/2">
          <Image
            src="https://wiley-my.sharepoint.com/personal/vpamugodar_wiley_com/Documents/Hackathon%20Images/banner.jpg"
            alt="Website Banner"
            width={1120}
            height={1120}
            unoptimized={true}
            className="h-full w-full object-cover" />
        </div>
        <div className="flex items-center justify-center p-6 lg:p-8 lg:flex-1">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-center">Sign Up</CardTitle>
            </CardHeader>
            <CardContent>
              <SignupForm />
            </CardContent>
            <CardFooter>
              <p className="mt-4 text-center">
                  Already have an account?{' '}
                  <Link href="/login" className="text-blue-500 hover:underline">Login</Link>
              </p>
            </CardFooter>
          </Card>
        </div>
      </div>
    </>
  )
}