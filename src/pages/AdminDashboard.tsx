import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'
import { 
  Users, Clock, TrendingUp, Activity, PlayCircle, PauseCircle, 
  SkipForward, RefreshCw, Settings
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { ProgressBar } from '@/components/ui/ProgressBar'
import { WaitTimeSettings } from '@/components/WaitTimeSettings'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import apiService, { AdminStats, QueueStats, QueueItem } from '@/lib/api'

const hourlyData = [
  { hour: '9AM', queue: 5 },
  { hour: '10AM', queue: 12 },
  { hour: '11AM', queue: 18 },
  { hour: '12PM', queue: 15 },
  { hour: '1PM', queue: 8 },
  { hour: '2PM', queue: 14 },
  { hour: '3PM', queue: 20 },
  { hour: '4PM', queue: 16 },
  { hour: '5PM', queue: 10 },
]

const serviceTimeData = [
  { range: '0-5m', count: 25 },
  { range: '5-10m', count: 45 },
  { range: '10-15m', count: 30 },
  { range: '15-20m', count: 15 },
  { range: '20m+', count: 5 },
]

export function AdminDashboard() {
  const [isAutoMode, setIsAutoMode] = useState(false)
  const [adminStats, setAdminStats] = useState<AdminStats | null>(null)
  const [queueStats, setQueueStats] = useState<QueueStats[]>([])
  const [selectedService, setSelectedService] = useState<string>('hospital')
  const [queueItems, setQueueItems] = useState<QueueItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
    const interval = setInterval(fetchDashboardData, 5000) // Refresh every 5 seconds
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    if (selectedService) {
      fetchQueueItems(selectedService)
    }
  }, [selectedService])

  const fetchDashboardData = async () => {
    try {
      const [stats, queues] = await Promise.all([
        apiService.getAdminStats(),
        apiService.getAllQueueStats()
      ])
      setAdminStats(stats)
      setQueueStats(queues)
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchQueueItems = async (serviceId: string) => {
    try {
      const items = await apiService.getQueueItems(serviceId)
      setQueueItems(items)
    } catch (error) {
      console.error('Failed to fetch queue items:', error)
    }
  }

  const handleCallNext = async () => {
    try {
      await apiService.callNext(selectedService)
      fetchDashboardData()
      fetchQueueItems(selectedService)
    } catch (error) {
      console.error('Failed to call next:', error)
    }
  }

  const handleSkipToken = async () => {
    try {
      await apiService.skipToken(selectedService)
      fetchQueueItems(selectedService)
    } catch (error) {
      console.error('Failed to skip token:', error)
    }
  }

  const stats = adminStats ? [
    { icon: Users, label: 'Active Queues', value: adminStats.totalQueues.toString(), color: 'text-primary', bg: 'bg-primary/10' },
    { icon: Clock, label: 'Avg. Wait Time', value: `${adminStats.averageWaitTime} min`, color: 'text-secondary', bg: 'bg-secondary/10' },
    { icon: TrendingUp, label: 'Total Served', value: adminStats.totalServed.toString(), color: 'text-success', bg: 'bg-success/10' },
    { icon: Activity, label: 'Peak Hour', value: adminStats.peakHour, color: 'text-warning', bg: 'bg-warning/10' },
  ] : []

  if (loading || !adminStats) {
    return (
      <div className="min-h-screen pt-24 pb-12 bg-background flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pt-24 pb-12 bg-background">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8"
        >
          <div>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <p className="text-muted-foreground">Manage and monitor queue operations</p>
          </div>
          <Button variant="outline" className="gap-2">
            <Settings className="w-4 h-4" />
            Settings
          </Button>
        </motion.div>

        {/* Stats Cards */}
        <motion.div
          initial="initial"
          animate="animate"
          variants={{
            animate: { transition: { staggerChildren: 0.1 } }
          }}
          className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              variants={{
                initial: { opacity: 0, y: 20 },
                animate: { opacity: 1, y: 0 }
              }}
            >
              <Card className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-xl ${stat.bg} flex items-center justify-center`}>
                      <stat.icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">{stat.label}</p>
                      <p className="text-2xl font-bold">{stat.value}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>

        {/* Service Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6"
        >
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <span className="text-sm font-medium">Managing:</span>
                <div className="flex gap-2">
                  {queueStats.map((queueStat) => (
                    <Button
                      key={queueStat.serviceId}
                      variant={selectedService === queueStat.serviceId ? 'default' : 'outline'}
                      size="sm"
                      onClick={() => setSelectedService(queueStat.serviceId)}
                    >
                      {queueStat.serviceId === 'hospital' ? 'Healthcare' :
                       queueStat.serviceId === 'bank' ? 'Banking' :
                       queueStat.serviceId === 'government' ? 'Government' : queueStat.serviceId}
                      ({queueStat.queueLength})
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* Queue Control */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1"
          >
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  Queue Control
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 rounded-full ${isAutoMode ? 'bg-success animate-pulse' : 'bg-muted'}`} />
                    <span className="text-sm font-normal text-muted-foreground">
                      {isAutoMode ? 'Auto' : 'Manual'}
                    </span>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Current Serving */}
                <div className="text-center p-6 rounded-xl bg-gradient-to-br from-primary/10 to-secondary/10">
                  <p className="text-sm text-muted-foreground mb-2">Now Serving</p>
                  <motion.p
                    key={queueStats.find(q => q.serviceId === selectedService)?.currentServing || '---'}
                    initial={{ scale: 1.2 }}
                    animate={{ scale: 1 }}
                    className="text-5xl font-extrabold gradient-text"
                  >
                    {queueStats.find(q => q.serviceId === selectedService)?.currentServing || '---'}
                  </motion.p>
                </div>

                {/* Control Buttons */}
                <div className="grid grid-cols-2 gap-3">
                  <Button
                    variant={isAutoMode ? 'destructive' : 'success'}
                    className="gap-2"
                    onClick={() => setIsAutoMode(!isAutoMode)}
                  >
                    {isAutoMode ? (
                      <>
                        <PauseCircle className="w-4 h-4" />
                        Stop Auto
                      </>
                    ) : (
                      <>
                        <PlayCircle className="w-4 h-4" />
                        Auto Mode
                      </>
                    )}
                  </Button>
                  <Button
                    variant="gradient"
                    className="gap-2"
                    onClick={handleCallNext}
                    disabled={queueItems.length === 0}
                  >
                    <RefreshCw className="w-4 h-4" />
                    Call Next
                  </Button>
                </div>

                <Button
                  variant="outline"
                  className="w-full gap-2"
                  onClick={handleSkipToken}
                  disabled={queueItems.length <= 1}
                >
                  <SkipForward className="w-4 h-4" />
                  Skip Current
                </Button>

                {/* Queue List */}
                <div>
                  <p className="text-sm font-medium mb-3">Waiting Queue ({queueItems.length})</p>
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {queueItems.map((item, i) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className={`flex items-center justify-between p-3 rounded-lg ${
                          i === 0 ? 'bg-primary/10 border border-primary/20' : 'bg-muted/50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <span className={`font-bold ${i === 0 ? 'text-primary' : ''}`}>
                            {item.token}
                          </span>
                          <span className="text-sm text-muted-foreground">{item.serviceName}</span>
                        </div>
                        <span className="text-sm text-muted-foreground">{item.estimatedWaitTime}m</span>
                      </motion.div>
                    ))}
                    {queueItems.length === 0 && (
                      <p className="text-center text-muted-foreground py-4">Queue is empty</p>
                    )}
                  </div>
                </div>

                {/* Wait Time Settings */}
                <div className="mt-6">
                  <WaitTimeSettings serviceId={selectedService} />
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Charts */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2 space-y-6"
          >
            {/* Queue Trend */}
            <Card>
              <CardHeader>
                <CardTitle>Queue Length Over Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={hourlyData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="hour" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="queue"
                        stroke="hsl(var(--primary))"
                        strokeWidth={3}
                        dot={{ fill: 'hsl(var(--primary))', strokeWidth: 2 }}
                        activeDot={{ r: 6, fill: 'hsl(var(--primary))' }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Service Time Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Service Time Distribution</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={serviceTimeData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="range" stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                        }}
                      />
                      <Bar
                        dataKey="count"
                        fill="hsl(var(--secondary))"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Counter Utilization */}
            <Card>
              <CardHeader>
                <CardTitle>Counter Utilization</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {['Counter 1', 'Counter 2', 'Counter 3'].map((counter, i) => (
                  <div key={counter} className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium">{counter}</span>
                      <span className="text-muted-foreground">
                        {i === 0 ? 'Active' : i === 1 ? 'Active' : 'Idle'}
                      </span>
                    </div>
                    <ProgressBar
                      progress={i === 0 ? 85 : i === 1 ? 72 : 0}
                      showLabel={false}
                      variant={i === 2 ? 'default' : 'success'}
                    />
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
