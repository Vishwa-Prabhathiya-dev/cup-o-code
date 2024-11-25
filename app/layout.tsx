import "./globals.css"
import { Inter } from "next/font/google"
import SessionProviderWrapper from "../components/SessionProviderWrapper";
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/authOptions"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Coffee Mood",
  description: "Get coffee recommendations based on your mood",
}

export default async function RootLayout({children}: {children: React.ReactNode}) {
  const session = await getServerSession(authOptions)
  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProviderWrapper sessionData={session}>{children}</SessionProviderWrapper>
      </body>
    </html>
  )
}

