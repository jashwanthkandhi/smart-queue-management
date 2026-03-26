import { motion } from 'framer-motion'
import { QRCodeSVG } from 'qrcode.react'
import { Download, Share2, Bell, BellOff } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { useState } from 'react'

export function TokenQRPage() {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true)
  const token = '---'
  const qrData = JSON.stringify({
    token: token,
    service: 'Healthcare',
    timestamp: new Date().toISOString(),
    queueId: 'HQ-2025-001'
  })

  const handleDownload = () => {
    const svg = document.querySelector('#qr-code svg')
    if (!svg) return
    
    const svgData = new XMLSerializer().serializeToString(svg)
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    const img = new Image()
    
    img.onload = () => {
      canvas.width = img.width
      canvas.height = img.height
      ctx?.drawImage(img, 0, 0)
      const link = document.createElement('a')
      link.download = `smartqueue-token-${token}.png`
      link.href = canvas.toDataURL('image/png')
      link.click()
    }
    
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData)
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'My Queue Token',
          text: `My SmartQueue token is ${token}. Show this at the counter.`,
          url: window.location.href,
        })
      } catch (err) {
        console.log('Share cancelled')
      }
    }
  }

  return (
    <div className="min-h-screen pt-24 pb-12 hero-gradient">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl sm:text-4xl font-bold mb-2">
            Your <span className="gradient-text">Digital Token</span>
          </h1>
          <p className="text-muted-foreground">Show this QR code when your turn is called</p>
        </motion.div>

        <div className="max-w-md mx-auto space-y-6">
          {/* QR Code Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="glass-card overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5" />
              <CardContent className="relative p-8">
                {/* Token Number */}
                <motion.div
                  initial={{ scale: 0.8 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring' }}
                  className="text-center mb-6"
                >
                  <p className="text-sm font-medium text-muted-foreground mb-1">Token Number</p>
                  <p className="text-5xl font-extrabold gradient-text">{token}</p>
                </motion.div>

                {/* QR Code */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                  id="qr-code"
                  className="bg-card p-6 rounded-2xl shadow-lg mx-auto w-fit"
                >
                  <div className="animate-pulse-slow">
                    <QRCodeSVG 
                      value={qrData}
                      size={200}
                      level="H"
                      includeMargin={false}
                      bgColor="hsl(var(--card))"
                      fgColor="hsl(var(--foreground))"
                    />
                  </div>
                </motion.div>

                {/* Service Info */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="mt-6 p-4 rounded-xl bg-muted/50 text-center"
                >
                  <p className="text-sm text-muted-foreground">Service</p>
                  <p className="font-semibold">Healthcare - General Checkup</p>
                </motion.div>

                {/* Instructions */}
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="text-center text-sm text-muted-foreground mt-6"
                >
                  Scan at counter when called
                </motion.p>
              </CardContent>
            </Card>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="grid grid-cols-2 gap-4"
          >
            <Button 
              variant="outline" 
              size="lg" 
              className="gap-2"
              onClick={handleDownload}
            >
              <Download className="w-5 h-5" />
              Download
            </Button>
            <Button 
              variant="outline" 
              size="lg" 
              className="gap-2"
              onClick={handleShare}
            >
              <Share2 className="w-5 h-5" />
              Share
            </Button>
          </motion.div>

          {/* Notification Toggle */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Card 
              className={`cursor-pointer transition-all duration-300 ${
                notificationsEnabled ? 'border-success/50 bg-success/5' : ''
              }`}
              onClick={() => setNotificationsEnabled(!notificationsEnabled)}
            >
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    notificationsEnabled ? 'bg-success/10' : 'bg-muted'
                  }`}>
                    {notificationsEnabled ? (
                      <Bell className="w-5 h-5 text-success" />
                    ) : (
                      <BellOff className="w-5 h-5 text-muted-foreground" />
                    )}
                  </div>
                  <div>
                    <p className="font-semibold">Alert when called</p>
                    <p className="text-sm text-muted-foreground">
                      {notificationsEnabled ? 'You will be notified' : 'Notifications disabled'}
                    </p>
                  </div>
                </div>
                <div className={`w-12 h-7 rounded-full transition-colors ${
                  notificationsEnabled ? 'bg-success' : 'bg-muted'
                } flex items-center px-1`}>
                  <motion.div
                    animate={{ x: notificationsEnabled ? 20 : 0 }}
                    className="w-5 h-5 rounded-full bg-card shadow"
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
