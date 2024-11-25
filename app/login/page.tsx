'use client'

import { useEffect, useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import LoadingScreen from '../../components/loading-screen'
import { useRouter } from 'next/navigation'
import { signIn, useSession } from 'next-auth/react';
import Link from 'next/link'

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
        <main className="flex min-h-screen flex-col items-center justify-center p-24">
            <h1 className="text-4xl font-bold mb-8">Coffee Mood</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <Input
                    type="email"
                    name="email"
                    placeholder="Email"
                    required
                    className="w-full"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    />
                </div>
                {
                    error && (
                    <p className="text-red-500 text-sm">{error}</p>
                    )
                }
                <Button type="submit" className="w-full" disabled={isLoading}>Login</Button>
                {
                    isLoading && (
                    <div className="fixed inset-0 bg-background/80 backdrop-blur-sm">
                        <LoadingScreen text="Loading..." size="medium" />
                    </div>
                    )
                }
            </form>
            <p className="mt-4 text-center">
                Don't have an account?{' '}
                <Link href="/signup" className="text-blue-500 hover:underline">Sign up</Link>
            </p>
        </main>
    )
}

