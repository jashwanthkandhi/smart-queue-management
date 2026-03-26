import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Clock, Users, Bell, QrCode, RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { ProgressBar } from '@/components/ui/ProgressBar'
import apiService, { TokenStatus } from '@/lib/api'

export function LiveStatusPage() {
  const [tokenStatus, setTokenStatus] = useState<TokenStatus | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentToken, setCurrentToken] = useState<string>('')

  useEffect(() => {
    const token = localStorage.getItem('currentToken')
    if (!token) {
      // Redirect to join page if no token
      window.location.href = '/'
      return
    }
    setCurrentToken(token)
  }, [])

  useEffect(() => {
    if (!currentToken) return

    const fetchTokenStatus = async () => {
      try {
        const status = await apiService.getTokenStatus(currentToken)
        setTokenStatus(status)
      } catch (error) {
        console.error('Failed to fetch token status:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchTokenStatus()

    // Poll for updates every 5 seconds
    const interval = setInterval(fetchTokenStatus, 5000)
    return () => clearInterval(interval)
  }, [currentToken])

  if (loading || !tokenStatus) {
    return (
      <div className="min-h-screen pt-24 pb-12 hero-gradient flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading queue status...</p>
        </div>
      </div>
    )
  }

  const position = tokenStatus.position
  const progress = Math.max(0, Math.min(100, (1 - position / 10) * 100)) // Simple progress calculation

  const isNext = position <= 1
  const isClose = position <= 3 && position > 1

  return (
    <div className="min-h-screen pt-24 pb-12 hero-gradient">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">
            Live <span className="gradient-text">Queue Status</span>
          </h1>
          <div className="flex items-center justify-center gap-2">
            <div className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span className="text-sm text-muted-foreground">Real-time updates</span>
          </div>
        </motion.div>

        <div className="max-w-2xl mx-auto space-y-6">
          {/* Main Token Display */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Card className={`relative overflow-hidden ${isNext ? 'ring-2 ring-success animate-glow' : ''}`}>
              {isNext && (
                <div className="absolute inset-0 bg-success/5" />
              )}
              <CardContent className="p-8 relative">
                <div className="text-center mb-6">
                  <p className="text-sm font-medium text-muted-foreground mb-2">Your Token Number</p>
                  <motion.div
                    key={tokenStatus.token}
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className={`text-7xl font-extrabold ${isNext ? 'text-success' : 'gradient-text'}`}
                  >
                    {tokenStatus.token}
                  </motion.div>
                </div>
                
                {isNext && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-success/10 rounded-xl p-4 text-center mb-6"
                  >
                    <p className="text-success font-bold text-lg">You're Next!</p>
                    <p className="text-success/80 text-sm">Please proceed to the counter</p>
                  </motion.div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className={`p-4 rounded-xl ${isClose ? 'bg-warning/10' : 'bg-muted/50'} text-center`}>
                    <p className="text-sm text-muted-foreground mb-1">Now Serving</p>
                    <motion.p 
                      key={tokenStatus.token}
                      initial={{ scale: 1.2 }}
                      animate={{ scale: 1 }}
                      className={`text-3xl font-bold ${isClose ? 'text-warning' : ''}`}
                    >
                      {tokenStatus.token.split('A')[1] ? `A${(parseInt(tokenStatus.token.split('A')[1]) - position + 1).toString().padStart(2, '0')}` : tokenStatus.token}
                    </motion.p>
                  </div>
                  <div className="p-4 rounded-xl bg-muted/50 text-center">
                    <p className="text-sm text-muted-foreground mb-1">Your Position</p>
                    <motion.p 
                      key={position}
                      initial={{ scale: 1.2 }}
                      animate={{ scale: 1 }}
                      className="text-3xl font-bold"
                    >
                      #{position > 0 ? position : 'NOW'}
                    </motion.p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Progress Bar */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <Card>
              <CardContent className="p-6">
                <ProgressBar 
                  progress={progress} 
                  variant={isNext ? 'success' : isClose ? 'warning' : 'default'}
                />
              </CardContent>
            </Card>
          </motion.div>

          {/* Info Cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="grid sm:grid-cols-3 gap-4"
          >
            <Card className="glass-card">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                  <Clock className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Est. Time</p>
                  <p className="font-bold">{tokenStatus.estimatedWaitTime} mins</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="glass-card">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-secondary" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Ahead of You</p>
                  <p className="font-bold">{Math.max(0, position - 1)} people</p>
                </div>
              </CardContent>
            </Card>
            
            <Card className="glass-card">
              <CardContent className="p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-accent/10 flex items-center justify-center">
                  <Bell className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground">Notifications</p>
                  <p className="font-bold text-success">Active</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link to="/token" className="flex-1">
              <Button variant="gradient" size="lg" className="w-full gap-2">
                <QrCode className="w-5 h-5" />
                View QR Code
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="flex-1 gap-2">
              <RefreshCw className="w-5 h-5" />
              Refresh Status
            </Button>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
