'use server'

import clientPromise from '@/lib/mongodb'

export async function registerUser(name: string, email: string, birthYear: string, gender: string, lowCalorie: string, coffeeLevel: number) {
  const client = await clientPromise
  const db = client.db('cupOCode');
  const existingUser = await db.collection('users').findOne({ email })

  if (existingUser) {
    return { error: 'User already exists' }
  }

  const result = await db.collection('users').insertOne({
    name,
    email,
    birthYear: parseInt(birthYear),
    gender,
    lowCalorie,
    coffeeLevel
  })

  if (!result.insertedId) {
    return { error: 'Failed to create user' }
  }

  return { success: true }
}

export async function addRecommendation(email: string, mood: string, isFirstCoffee: boolean, recommendation: string, timestamp: Date) {
  const client = await clientPromise
  const db = client.db('cupOCode');

  const result = await db.collection('recommendations').insertOne({
    email,
    mood,
    isFirstCoffee,
    recommendation,
    timestamp
  })

  if (!result.insertedId) {
    return { error: 'Failed to create recommendation' }
  }

  return { success: true }
}