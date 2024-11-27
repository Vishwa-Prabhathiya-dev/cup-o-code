"use client"

import { Header } from '../../components/header'
import { ProfileForm } from '../../components/profile-form'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useSession } from "next-auth/react"
import { useState, useEffect } from "react"
import { useRouter } from 'next/navigation'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { getUser } from '../actions'
import LoadingScreen from '../../components/loading-screen'
import { useToast } from "@/hooks/use-toast"

export default function ProfilePage() {
    const { toast } = useToast()
    const { data: session, status } = useSession();
    const router = useRouter()
    const [avatarUrl, setAvatarUrl] = useState('https://ui.shadcn.com/avatars/04.png')
    const [isLoading, setIsLoading] = useState(true)
    const [userData, setUserData] = useState<{ email?: string; name?: string; birthYear?: number; gender?: string; lowCalorie?: string; coffeeLevel?: number } | null>(null);
    
    useEffect(() => {
        if (status === 'unauthenticated') {
        router.push('/')
        }
    }, [status, router])
    
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
                    switch (res.data.gender) {
                        case 'Male':
                            setAvatarUrl('https://ui.shadcn.com/avatars/02.png')
                            break;
                        case 'Female':
                            setAvatarUrl('https://ui.shadcn.com/avatars/05.png')
                            break;
                        default:
                            setAvatarUrl('https://ui.shadcn.com/avatars/04.png')
                            break;
                    }
                }
            }
            setIsLoading(false)
        }

        if (session?.user?.email && !userData) {
            setIsLoading(true)
            getUserData(session.user.email);
        }
    }, [userData, session, toast])
    
    const userName = userData?.name || 'Anonymous';

    return (
        <div className="min-h-screen flex flex-col bg-background">
            {
                !isLoading && (
                    <Header userName={userName} gender={userData?.gender || 'I dont want to disclose'} />
                )
            }
            <main className="flex-grow container mx-auto px-4 py-8 flex items-center justify-center">
                <Card>
                    <CardHeader>
                        <CardTitle className="text-3xl font-bold text-center">Profile</CardTitle>
                    </CardHeader>
                    {
                        !isLoading && (
                            <CardContent className="space-y-8">
                                <div className="flex flex-col items-center space-y-4">
                                    <Avatar className="w-32 h-32">
                                        <AvatarImage src={avatarUrl} alt={userName} />
                                        <AvatarFallback className="bg-accent text-accent-foreground text-4xl">
                                            {userName.charAt(0).toUpperCase()}
                                        </AvatarFallback>
                                    </Avatar>
                                </div>
                        
                                <ProfileForm
                                    name={userName}
                                    email={userData?.email || ''}
                                    birthYear={userData?.birthYear || 1900}
                                    gender={userData?.gender || 'I dont want to disclose'}
                                    lowCalorie={userData?.lowCalorie || 'No'}
                                    coffeeLevel={userData?.coffeeLevel || 2} />
                            </CardContent>
                        )
                    }
                </Card>
            </main>
            {
                isLoading && (
                    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm">
                        <LoadingScreen text="Loading..." size="medium" />
                    </div>
                )
            }
        </div>
    )
}

