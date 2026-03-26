import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Heart, Landmark, Building2, Clock, Users, ArrowRight, Check, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { useToast } from '@/components/ui/Toast'
import apiService from '@/lib/api'

interface ServiceType {
  id: string;
  name: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  queueLength: number;
  averageWaitTime: number;
  waitTime: string;
}

const iconMap = {
  Heart,
  Landmark,
  Building2
}

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 }
}

export function JoinQueuePage() {
  const [selectedService, setSelectedService] = useState<string | null>(null)
  const [isJoining, setIsJoining] = useState(false)
  const [joined, setJoined] = useState(false)
  const [services, setServices] = useState<ServiceType[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const { showToast } = useToast()

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const apiServices = await apiService.getServices()
        const servicesWithIcons: ServiceType[] = apiServices.map(service => ({
          ...service,
          icon: iconMap[service.icon as keyof typeof iconMap] || Heart,
          waitTime: `~${service.averageWaitTime} mins`
        }))
        setServices(servicesWithIcons)
      } catch (error) {
        console.error('Failed to fetch services:', error)
        showToast('Failed to load services', 'error')
      } finally {
        setLoading(false)
      }
    }

    fetchServices()
  }, [showToast])

  const handleJoinQueue = async () => {
    if (!selectedService) return

    setIsJoining(true)

    try {
      const response = await apiService.joinQueue(selectedService)
      setJoined(true)
      showToast(`Successfully joined the queue! Your token is ${response.token}`, 'success')

      // Store token in localStorage for status page
      localStorage.setItem('currentToken', response.token)

      // Navigate to status page after animation
      setTimeout(() => {
        navigate('/status')
      }, 1500)
    } catch (error) {
      console.error('Failed to join queue:', error)
      showToast('Failed to join queue', 'error')
      setIsJoining(false)
    }
  }

  const selectedServiceData = services.find(s => s.id === selectedService)

  return (
    <div className="min-h-screen pt-24 pb-12 hero-gradient">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">
            Join a <span className="gradient-text">Queue</span>
          </h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            Select a service to join the queue and get your digital token
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto">
          {/* Service Selection */}
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <span className="ml-2 text-muted-foreground">Loading services...</span>
            </div>
          ) : (
            <motion.div
              variants={{
                animate: { transition: { staggerChildren: 0.1 } }
              }}
              initial="initial"
              animate="animate"
              className="grid md:grid-cols-3 gap-6 mb-8"
            >
              {services.map((service) => (
                <motion.div key={service.id} variants={fadeInUp}>
                  <Card
                    className={`cursor-pointer transition-all duration-300 hover:shadow-xl ${
                      selectedService === service.id
                        ? 'ring-2 ring-primary shadow-glow border-primary'
                        : 'hover:-translate-y-1'
                    }`}
                    onClick={() => setSelectedService(service.id)}
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className={`w-14 h-14 rounded-2xl ${service.bgColor} flex items-center justify-center`}>
                          <service.icon className={`w-7 h-7 ${service.color}`} />
                        </div>
                        {selectedService === service.id && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="w-8 h-8 rounded-full bg-primary flex items-center justify-center"
                          >
                            <Check className="w-5 h-5 text-primary-foreground" />
                          </motion.div>
                        )}
                      </div>

                      <h3 className="text-xl font-bold mb-4">{service.name}</h3>

                      <div className="space-y-3">
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="w-4 h-4 text-muted-foreground" />
                          <span className="text-muted-foreground">Est. Wait:</span>
                          <span className="font-semibold text-primary">{service.waitTime}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <Users className="w-4 h-4 text-muted-foreground" />
                          <span className="text-muted-foreground">In Queue:</span>
                          <span className="font-semibold">{service.queueLength} people</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Join Button */}
          {selectedService && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center"
            >
              <Card className="glass-card max-w-md mx-auto">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <p className="text-sm text-muted-foreground">Selected Service</p>
                      <p className="text-lg font-bold">{selectedServiceData?.name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Estimated Wait</p>
                      <p className="text-lg font-bold text-primary">{selectedServiceData?.waitTime}</p>
                    </div>
                  </div>
                  
                  <Button
                    variant="gradient"
                    size="lg"
                    className="w-full gap-2"
                    onClick={handleJoinQueue}
                    disabled={isJoining || joined}
                  >
                    {joined ? (
                      <>
                        <Check className="w-5 h-5" />
                        Joined Successfully!
                      </>
                    ) : isJoining ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Joining Queue...
                      </>
                    ) : (
                      <>
                        Join Queue
                        <ArrowRight className="w-5 h-5" />
                      </>
                    )}
                  </Button>
                  
                  <p className="text-xs text-muted-foreground mt-4">
                    You'll receive a digital token and real-time updates
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  )
}
