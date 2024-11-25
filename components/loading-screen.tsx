import { Loader2 } from 'lucide-react'

interface LoadingScreenProps {
  text?: string
  size?: 'small' | 'medium' | 'large'
}

export default function LoadingScreen({ text = 'Loading...', size = 'medium' }: LoadingScreenProps) {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12'
  }

  const textSizeClasses = {
    small: 'text-sm',
    medium: 'text-base',
    large: 'text-lg'
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[200px] h-full">
      <Loader2 className={`animate-spin ${sizeClasses[size]}`} />
      <p className={`mt-2 ${textSizeClasses[size]} text-muted-foreground`}>{text}</p>
    </div>
  )
}

