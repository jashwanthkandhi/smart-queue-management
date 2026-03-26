import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface ProgressBarProps {
  progress: number
  className?: string
  showLabel?: boolean
  variant?: 'default' | 'success' | 'warning'
}

export function ProgressBar({ progress, className, showLabel = true, variant = 'default' }: ProgressBarProps) {
  const variants = {
    default: 'from-primary to-secondary',
    success: 'from-success to-accent',
    warning: 'from-warning to-destructive',
  }

  return (
    <div className={cn("w-full", className)}>
      {showLabel && (
        <div className="flex justify-between mb-2 text-sm">
          <span className="text-muted-foreground">Progress</span>
          <span className="font-semibold text-foreground">{Math.round(progress)}%</span>
        </div>
      )}
      <div className="h-3 bg-muted rounded-full overflow-hidden">
        <motion.div
          className={cn("h-full rounded-full bg-gradient-to-r", variants[variant])}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 1, ease: "easeOut" }}
        />
      </div>
    </div>
  )
}
