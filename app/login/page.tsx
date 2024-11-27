'use client'

import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import LoadingScreen from '../../components/loading-screen'
import { useRouter } from 'next/navigation'
import { signIn, useSession } from 'next-auth/react';
import Link from 'next/link'
import Image from 'next/image'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'

export default function Login() {
    const router = useRouter()
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false)
    const { data: session, status } = useSession()
    
    useEffect(() => {
        if (status === 'authenticated') {
            router.push('/dashboard')
        }
    }, [status, router])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true)
        try {
            const res = await signIn('credentials', {
                email,
                redirect: false,
            });

            if (res?.error) {
                console.log('An error occurred when login: ', res.error);
                setError('Invalid credentials. Please try again.');
            } else {
                router.push('/dashboard')
            }
        } catch (error) {
            console.error('An error occurred: ' + error);
        }
        finally {
            setIsLoading(false)
        }
    };

    if (status === 'loading') {
        return <div className="min-h-screen flex items-center justify-center">Loading...</div>
    }
    if (status === 'authenticated') {
        return null
    }
    
    return (
        <>
            <div className="flex justify-center p-4 lg:hidden">
                <Image
                    src="https://i.ibb.co/Y03pxkh/logo.png"
                    alt="Brew Your Mood"
                    width={100}
                    height={100}
                    className="h-16 w-auto"
                    unoptimized={true} />
            </div>
            <div className="flex min-h-screen flex-col lg:flex-row">
                <div className="relative hidden w-full lg:block lg:w-1/2">
                    <Image
                        src="https://i.ibb.co/CHrtGDt/banner.png"
                        alt="Website Banner"
                        width={1120}
                        height={1120}
                        unoptimized={true}
                        className="h-full w-full object-cover" />
                </div>
                <div className="flex items-center justify-center p-6 lg:p-8 lg:flex-1">
                    <Card className="w-full max-w-md">
                        <CardHeader>
                            <CardTitle className="text-2xl font-bold text-center">Login</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <Input
                                    type="email"
                                    name="email"
                                    placeholder="Email"
                                    required
                                    className="w-full"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)} />
                                </div>
                                {
                                    error && (
                                        <p className="text-red-500 text-sm">{error}</p>
                                    )
                                }
                                <Button type="submit" className="w-full" disabled={isLoading}>Login</Button>
                            </form>
                        </CardContent>
                        <CardFooter>
                            <p className="mt-4 text-center">
                                Don't have an account?{' '}
                                <Link href="/signup" className="text-blue-500 hover:underline">Sign up</Link>
                            </p>
                        </CardFooter>
                    </Card>
                </div>
                {
                    isLoading && (
                        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm">
                            <LoadingScreen text="Loading..." size="medium" />
                        </div>
                    )
                }
            </div>
        </>
    )
}

