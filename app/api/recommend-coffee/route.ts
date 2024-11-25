import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

export async function POST(req: Request) {
  const { mood, isFirstCoffee, decodedEmail } = await req.json()

  // Simple recommendation logic
  let recommendation = "Espresso"
  if (mood === "tired" && isFirstCoffee) {
    recommendation = "Double Shot Espresso"
  } else if (mood === "happy") {
    recommendation = "Cappuccino"
  } else if (mood === "stressed") {
    recommendation = "Chamomile Tea"
  }

  // Save recommendation to database
  const client =  await clientPromise
  const db = client.db('cupOCode')
  await db.collection("recommendations").insertOne({
    email: decodedEmail,
    mood,
    isFirstCoffee,
    recommendation,
    timestamp: new Date(),
  })

  return NextResponse.json({ recommendation })
}