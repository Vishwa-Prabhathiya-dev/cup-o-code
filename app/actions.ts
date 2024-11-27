'use server'

import clientPromise from '@/lib/mongodb'

export async function getUser(email: string) {
  try {
    const client = await clientPromise
    const db = client.db('cupOCode');
    const user = await db.collection('users').findOne({ email })

    if (!user) {
      return { error: 'No user found!' }
    }

    return { success: true, data: JSON.parse(JSON.stringify(user)) }
  } catch (error) {
    console.log('getUser err: ' + error)
    return { error: error }
  }
}

export async function registerUser(name: string, email: string, birthYear: string, gender: string, lowCalorie: string, coffeeLevel: number) {
  try {
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
  } catch (error) {
    console.log('registerUser err: ' + error)
    return { error: error }
  }
}

export async function updateUser(email: string, lowCalorie: string, coffeeLevel: number) {
  try {
    const client = await clientPromise
    const db = client.db('cupOCode');

    const result = await db.collection('users').findOneAndUpdate
    (
      { email },
      {
        $set: {
          lowCalorie,
          coffeeLevel
        }
      },
      { returnDocument: 'after' }
    )

    if (!result) {
      return { error: 'Failed to update user' }
    }

    return { success: true }
  } catch (error) {
    console.log('updateUser err: ' + error)
    return { error: error }
  }
}

export async function addRecommendation(email: string, mood: string, isFirstCoffee: string, recommendation: string, timestamp: Date) {
  try {
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
  } catch (error) {
    console.log('addRecommendation err: ' + error)
    return { error: error }
  }
}

export async function fetchWeather(latitude: number, longitude: number) {
  const APIKey = process.env.WEATHER_API_KEY
  try {
    const response = await fetch(`https://api.weatherapi.com/v1/current.json?key=${APIKey}&q=${latitude},${longitude}&aqi=no`)
    if (!response) throw new Error('Failed to fetch weather data')
    const weatherData = await response.json();
    if (weatherData?.current?.condition?.text) {
      const weather = weatherData.current.condition.text;
      if(weather.toLowerCase().includes('sunny') || weather.toLowerCase().includes('clear')) {
        return 'Sunny';
      }
      else if (
        weather.toLowerCase().includes('cloudy') || weather.toLowerCase().includes('overcast')
        || weather.toLowerCase().includes('mist') || weather.toLowerCase().includes('fog')) {
        return 'Cloudy';
      }
      else {
        return 'Rainy';
      }
    }
    else {
      return 'Sunny';
    }
  } catch (err) {
    console.log('fetchWeather err: ' + err)
  }
  return 'Sunny';
}