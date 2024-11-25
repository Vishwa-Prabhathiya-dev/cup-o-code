'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import LoadingScreen from './loading-screen'
import { useRouter } from 'next/navigation'
import { registerUser } from '../app/actions'
import Rating from '@mui/material/Rating';
import CoffeeIcon from '@mui/icons-material/Coffee';
import CoffeeOutlinedIcon from '@mui/icons-material/CoffeeOutlined';
import { styled } from '@mui/material/styles';

const StyledRating = styled(Rating)({
  '& .MuiRating-iconFilled': {
    color: '#6F4E37',
  },
  '& .MuiRating-iconHover': {
    color: '#513b2c',
  },
});

export default function SignupForm() {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [birthYear, setBirthYear] = useState('')
  const [gender, setGender] = useState('')
  const [lowCalorie, setLowCalorie] = useState('');
  const [coffeeLevel, setCoffeeLevel] = useState(2);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true)
    try {
      const res = await registerUser(name, email, birthYear, gender, lowCalorie, coffeeLevel);
      if (res?.error) {
        console.log('An error occurred when login: ', res.error);
        setError(res.error);
      } else {
        router.push('/login')
      }
    } catch (error) {
      console.error('An error occurred: ' + error);
      setError('An error occurred during registration')
    }
    finally {
      setIsLoading(false)
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Input
          type="text"
          name="name"
          placeholder="Name"
          required
          className="w-full"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
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
      <div>
        <Input
          type="number"
          name="birthYear"
          placeholder="Birth Year"
          required
          min="1900"
          max={new Date().getFullYear()}
          className="w-full"
          value={birthYear}
          onChange={(e) => setBirthYear(e.target.value)}
        />
      </div>
      <div>
        <Select name="gender" required
          value={gender}
          onValueChange={(value) => setGender(value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select Gender" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="male">Male</SelectItem>
            <SelectItem value="female">Female</SelectItem>
            <SelectItem value="other">Other</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Select name="lowCalorie" required
          value={lowCalorie}
          onValueChange={(value) => setLowCalorie(value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Low-Calorie Diet?" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="yes">Yes</SelectItem>
            <SelectItem value="no">No</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className='flex justify-between items-center'>
        <Label htmlFor="coffeeLevel" className='mr-5 pl-2'>How strong do you like coffee?</Label>
        <StyledRating
          id="coffeeLevel"
          name="coffeeLevel"
          getLabelText={(value: number) => `${value} Coffee${value !== 1 ? 's' : ''}`}
          precision={1}
          icon={<CoffeeIcon fontSize="inherit" />}
          emptyIcon={<CoffeeOutlinedIcon fontSize="inherit" />}
          value={coffeeLevel}
          onChange={(event, newValue) => {setCoffeeLevel(Number(newValue))}}
        />
      </div>
      {
        error && (
          <p className="text-red-500 text-sm">{error}</p>
        )
      }
      <Button type="submit" className="w-full" disabled={isLoading}>Sign up</Button>
      {
        isLoading && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm">
            <LoadingScreen text="Loading..." size="medium" />
          </div>
        )
      }
    </form>
  )
}

