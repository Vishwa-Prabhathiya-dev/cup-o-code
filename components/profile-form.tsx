'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useToast } from "@/hooks/use-toast"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import LoadingScreen from './loading-screen'
import Rating from '@mui/material/Rating';
import CoffeeIcon from '@mui/icons-material/Coffee';
import CoffeeOutlinedIcon from '@mui/icons-material/CoffeeOutlined';
import { styled } from '@mui/material/styles';
import { updateUser } from '../app/actions'

const StyledRating = styled(Rating)({
  '& .MuiRating-iconFilled': {
    color: '#6F4E37',
  },
  '& .MuiRating-iconHover': {
    color: '#513b2c',
  },
});

export function ProfileForm({ name, email, birthYear, gender, lowCalorie, coffeeLevel }: { name: string; email: string; birthYear: number; gender: string; lowCalorie: string; coffeeLevel: number; }) {
  const { toast } = useToast()
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false)
  const [coffeeLevelNumber, setCoffeeLevel] = useState(coffeeLevel);
  const [isLowCalorie, setLowCalorie] = useState(lowCalorie);
    
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true)
    try {
      const res = await updateUser(email, isLowCalorie, coffeeLevelNumber);
      if (res?.error) {
        console.log('An error occurred when updating: ' + res.error);
        setError(res.error as string);
      }
      else {
        toast({
          title: "Profile updated",
          description: "Your profile details have been saved.",
          })
      }
    } catch (error) {
      console.error('An error occurred: ' + error);
      setError('An error occurred during updating the user.')
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
          disabled
          required
          className="w-full"
          value={name}
        />
      </div>
      <div>
        <Input
          type="email"
          name="email"
          disabled
          required
          className="w-full"
          value={email}
        />
      </div>
      <div>
        <Input
          type="number"
          name="birthYear"
          disabled
          required
          min="1900"
          max={new Date().getFullYear()}
          className="w-full"
          value={birthYear}
        />
      </div>
      <div>
        <Select name="gender" required disabled
          value={gender}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select Gender" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Male">Male</SelectItem>
            <SelectItem value="Female">Female</SelectItem>
            <SelectItem value="I dont want to disclose">I don't want to disclose</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="lowCalorie" className='mr-5 pl-2'>Low-Calorie Diet?</Label>
        <Select name="lowCalorie" required
          value={isLowCalorie}
          onValueChange={(value) => setLowCalorie(value)}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Low-Calorie Diet?" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Yes">Yes</SelectItem>
            <SelectItem value="No">No</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div className='flex justify-between items-center'>
        <Label htmlFor="coffeeLevel" className='mr-5 pl-2 mt-2 mb-2'>How strong do you like coffee?</Label>
        <StyledRating
          id="coffeeLevel"
          name="coffeeLevel"
          className='mt-2 mb-2'
          getLabelText={(value: number) => `${value} Coffee${value !== 1 ? 's' : ''}`}
          precision={1}
          icon={<CoffeeIcon fontSize="inherit" />}
          emptyIcon={<CoffeeOutlinedIcon fontSize="inherit" />}
          value={coffeeLevelNumber}
          onChange={(event, newValue) => {setCoffeeLevel(Number(newValue))}}
        />
      </div>
      {
        error && (
          <p className="text-red-500 text-sm">{error}</p>
        )
      }
      <Button type="submit" className="w-full" disabled={isLoading}>Save</Button>
      {
        isLoading && (
          <div className="fixed inset-0 bg-background/80 backdrop-blur-sm">
            <LoadingScreen text="Saving..." size="medium" />
          </div>
        )
      }
    </form>
  )
}