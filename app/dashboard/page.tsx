"use client"

import { useState, useEffect } from "react"
import { useSession, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import LoadingScreen from '../../components/loading-screen'
import { useParams, useRouter } from 'next/navigation'
import { addRecommendation } from '../actions'

export default function CoffeeRecommendation() {
  const { data: session, status } = useSession();
  const params = useParams<{ email: string }>()
  const decodedEmail = decodeURIComponent(params.email)
  const [mood, setMood] = useState("")
  const [isFirstCoffee, setIsFirstCoffee] = useState<boolean | null>(null)
  const [recommendation, setRecommendation] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('');
  const router = useRouter()

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/')
    }
  }, [status, router])

  if (!session) {
    return null;
  }

  const email = session.user?.email || '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      const response = await fetch("/api/recommend-coffee", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mood, isFirstCoffee }),
      })
      const data = await response.json()
      setIsLoading(false)
      setRecommendation(data.recommendation)

      const res = await addRecommendation(email, mood, isFirstCoffee ?? false, data.recommendation, new Date());
      if (res?.error) {
        console.log('An error occurred when inserting recommendation: ', res.error);
        setError(res.error);
      }
    } catch (error) {
      console.error('An error occurred: ' + error);
      setError('An error occurred during recommendation')
    }
    finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <div className="divide-y divide-gray-200 ">
        <div className="flex justify-between items-center px-2">
          <div className="py-2 text-sm text-gray-700">
            <p className="text-left">You are logged in as: {email}</p>
            <p className="text-left">Name: {session.user?.name}</p>
          </div>
          <Button 
            onClick={() => signOut({ callbackUrl: '/login' })}
            variant="outline"
            className="text-indigo-600 hover:text-indigo-500 font-bold"
          >Logout</Button>
        </div>
        
        <main className="flex flex-col items-center justify-center p-24">
          <h1 className="text-4xl font-bold mb-8 mt-5">Coffee Mood</h1>
          <div className="space-y-8 w-full max-w-md">
            {
              !recommendation && (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <Select onValueChange={(value) => setMood(value)}>
                    <SelectTrigger>
                        <SelectValue placeholder="How do you feel today?" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="energetic">Energetic</SelectItem>
                        <SelectItem value="tired">Tired</SelectItem>
                        <SelectItem value="happy">Happy</SelectItem>
                        <SelectItem value="stressed">Stressed</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="space-x-4">
                    <Button
                        type="button"
                        variant={isFirstCoffee === true ? "default" : "outline"}
                        onClick={() => setIsFirstCoffee(true)}
                    >First coffee</Button>
                    <Button
                        type="button"
                        variant={isFirstCoffee === false ? "default" : "outline"}
                        onClick={() => setIsFirstCoffee(false)}
                    >Not first coffee</Button>
                  </div>
                  <Button type="submit" className="w-full">Get Recommendation</Button>
                </form>
              )
            }
            {
              isLoading && (
                <div className="fixed inset-0 bg-background/80 backdrop-blur-sm">
                  <LoadingScreen text="Fetching data..." size="medium" />
                </div>
              )
            }
            {
              recommendation && (
                <Card>
                  <CardHeader>
                    <CardTitle>Your Coffee Recommendation</CardTitle>
                    <CardDescription>Based on your mood and coffee habits</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-2xl font-bold">{recommendation}</p>
                  </CardContent>
                </Card>
              )
            }
          </div>
        </main>
      </div>
    </div>
  )
}

