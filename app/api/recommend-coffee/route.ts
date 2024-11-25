import { NextResponse } from "next/server"

export async function POST(req: Request) {
  const { mood, isFirstCoffee } = await req.json()

  // Simple recommendation logic
  let recommendation = "Espresso"
  if (mood === "tired" && isFirstCoffee) {
    recommendation = "Double Shot Espresso"
  } else if (mood === "happy") {
    recommendation = "Cappuccino"
  } else if (mood === "stressed") {
    recommendation = "Chamomile Tea"
  }

  return NextResponse.json({ recommendation })
}