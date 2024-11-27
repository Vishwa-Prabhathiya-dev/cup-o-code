"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import LoadingScreen from '../../components/loading-screen'
import { useRouter } from 'next/navigation'
import { addRecommendation, fetchWeather, getUser } from '../actions'
import Image from 'next/image'
import { Label } from "@/components/ui/label"
import { Header } from "../../components/header"
import { useToast } from "@/hooks/use-toast"

export default function CoffeeRecommendation() {
  const { toast } = useToast()
  const { data: session, status } = useSession();
  const [mood, setMood] = useState('')
  const [isfirstCofee, setIsFirstCoffee] = useState('')
  const [climate, setWeather] = useState('Sunny')
  const [latitude, setLatitude] = useState<number | null>(null)
  const [preferredTime, setTimeOfDay] = useState<string>('')
  const [recommendation, setRecommendation] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const [userData, setUserData] = useState<{ email?: string; name?: string; birthYear?: number; gender?: string; lowCalorie?: string; coffeeLevel?: number } | null>(null);

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/')
    }
  }, [status, router])

  useEffect(() => {
    const getWeather = async (latitude: number, longitude: number) => {
      const res = await fetchWeather(latitude, longitude)
      setWeather(res);
    }

    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLatitude(position.coords.latitude);
          if (latitude) {
            getWeather(position.coords.latitude, position.coords.longitude)
          }
        },
        () => {
          setWeather('Sunny');
          console.log('Weather error : Unable to retrieve your location')
        }
      )
    } else {
      setWeather('Sunny');
      console.log('Weather error : Geolocation is not supported by your browser')
    }
  }, [router, latitude])

  useEffect(() => {
    const updateTimeOfDay = () => {
      const hour = new Date().getHours()
      if (hour >= 0 && hour < 12) {
        setTimeOfDay('Morning')
      } else if (hour >= 12 && hour < 19) {
        setTimeOfDay('Evening')
      } else {
        setTimeOfDay('Night')
      }
    }

    updateTimeOfDay()
    const interval = setInterval(updateTimeOfDay, 60000) // Update every minute
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    const getUserData = async (email: string) => {
      const res = await getUser(email)
      if (res?.error) {
        console.log('An error occurred when fetching user data: ' + res.error);
        toast({
          variant: "destructive",
          title: "Uh oh! Something went wrong.",
          description: "There was a problem when retrieving your data. Please try again.",
        })
      } else {
        if (res.data) {
          setUserData(res.data);
        }
      }
      setIsLoading(false)
    }

    if (session?.user?.email && !userData) {
      setIsLoading(true)
      getUserData(session.user.email);
    }
  }, [userData, session, toast])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    
    try {
      if (userData) {
        const currentYear = new Date().getFullYear();
        const age = userData.birthYear ? currentYear - userData.birthYear : 0;
        const apiBody = JSON.stringify({ 
          gender: userData.gender, 
          mood: mood, 
          isfirstCofee: isfirstCofee, 
          isLowCalorieDiet: userData.lowCalorie, 
          cofeeLevel: userData.coffeeLevel, 
          preferredTime: preferredTime, 
          climate: climate, 
          age: age 
        });
        const response = await fetch("https://cofeerecommendation.onrender.com/coffee/recommendations", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
          body: apiBody,
        })
        const data = await response.json();
        if (data.recomendedCofee) {
          setRecommendation(data.recomendedCofee)
          const res = await addRecommendation(userData.email || '', mood, isfirstCofee, data.recomendedCofee, new Date());
          if (res?.error) {
            console.log('An error occurred when inserting recommendation: ', res.error);
            toast({
              variant: "destructive",
              title: "Uh oh! Something went wrong.",
              description: "There was a problem when saving your recommendation. Please try again.",
            })
          }
        }
        else {
          console.error('An error occurred retrieving recommendation: ' + JSON.stringify(data));
          toast({
            variant: "destructive",
            title: "Uh oh! Something went wrong.",
            description: "There was a problem when retrieving your recommendation. Please try again.",
          })
        }
        setIsLoading(false)
      }
    } catch (error) {
      console.error('An error occurred: ' + error);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem when retrieving your recommendation. Please try again.",
      })
    }
    finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <div className="min-h-screen flex flex-col bg-background">
        {
          !isLoading && (
            <Header userName={userData?.name || 'Anonymous'} gender={userData?.gender || 'I dont want to disclose'} />
          )
        }
        <main className="flex-grow container mx-auto px-4 py-8 flex items-center justify-center">
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-center">Brew Your Mood</CardTitle>
            </CardHeader>
            <CardContent className="space-y-8">
              {
                !recommendation && (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="flex flex-col">
                      <Label className='mr-5 pl-2 text-center'>How do you feel today?</Label>
                      <div className="flex flex-row" style={{ flexWrap: 'wrap', justifyContent: 'center' }}>
                        <button
                          type="button"
                          title="Happy or Relaxed"
                          style={mood === 'Happy or Relaxed' ? { fontSize: 'xxx-large' } : {}}
                          className="hover:scale-125 transition-transform ease-in-out duration-200 p-4 text-4xl"
                          onClick={() => setMood('Happy or Relaxed')}
                        >😊</button>
                        <button
                          type="button"
                          title="Focused or Determined"
                          style={mood === 'Focused or Determined' ? { fontSize: 'xxx-large' } : {}}
                          className="hover:scale-125 transition-transform ease-in-out duration-200 p-4 text-4xl"
                          onClick={() => setMood('Focused or Determined')}
                        >💪</button>
                        <button
                          type="button"
                          title="Stressed or Overwhelmed"
                          style={mood === 'Stressed or Overwhelmed' ? { fontSize: 'xxx-large' } : {}}
                          className="hover:scale-125 transition-transform ease-in-out duration-200 p-4 text-4xl"
                          onClick={() => setMood('Stressed or Overwhelmed')}
                        >😫</button>
                        <button
                          type="button"
                          title="Bored or Unmotivated"
                          style={mood === 'Bored or Unmotivated' ? { fontSize: 'xxx-large' } : {}}
                          className="hover:scale-125 transition-transform ease-in-out duration-200 p-4 text-4xl"
                          onClick={() => setMood('Bored or Unmotivated')}
                        >😒</button>
                        <button
                          type="button"
                          title="Tired or Sleepy"
                          style={mood === 'Tired or Sleepy' ? { fontSize: 'xxx-large' } : {}}
                          className="hover:scale-125 transition-transform ease-in-out duration-200 p-4 text-4xl"
                          onClick={() => setMood('Tired or Sleepy')}
                        >😴</button>
                      </div>
                    </div>
                    <div className="space-x-4 flex justify-center">
                      <Button
                          type="button"
                          variant={isfirstCofee === 'Yes' ? "default" : "outline"}
                          onClick={() => setIsFirstCoffee('Yes')}
                      >First coffee</Button>
                      <Button
                          type="button"
                          variant={isfirstCofee === 'No' ? "default" : "outline"}
                          onClick={() => setIsFirstCoffee('No')}
                      >Not first coffee</Button>
                    </div>
                    <Button type="submit" className="w-full" disabled={!mood || !isfirstCofee}>Get Recommendation</Button>
                  </form>
                )
              }
              {
                recommendation && (
                  <div className="flex flex-col" style={{ alignItems: 'center' }}>
                    <div className="flex flex-col space-y-1.5 p-6">
                      <div className="font-semibold leading-none tracking-tight">Your Coffee Recommendation</div>
                      <div className="text-sm text-muted-foreground">Based on your mood and coffee habits</div>
                    </div>
                    <div style={{ ["width"]: "250px" }}>
                      <Image
                        src={'https://wiley-my.sharepoint.com/personal/vpamugodar_wiley_com/Documents/Hackathon%20Images/coffee_cup_01.gif'}
                        layout={'responsive'}
                        height={250}
                        width={250}
                        alt={'My Coffee Cup'}
                        unoptimized={true}
                      />
                    </div>
                    <div className="flex items-center p-6 pt-0">
                      <p className="text-2xl font-bold text-center">{recommendation}</p>
                    </div>
                  </div>
                )
              }
            </CardContent>
            {
              recommendation && (
                <CardFooter>
                  <Button type="button"
                    className="w-full" disabled={!recommendation}
                    variant="outline"
                    onClick={() => {
                      setRecommendation('');
                      setMood('');
                      setIsFirstCoffee('');
                    }} >Try Another Cup</Button>
                </CardFooter>
              )
            }
          </Card>
        </main>
      </div>
      {
        isLoading && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm">
            <LoadingScreen text={!userData ? "Loading..." : "AI is working..."} size="medium" />
          </div>
        )
      }
    </div>
  )
}

