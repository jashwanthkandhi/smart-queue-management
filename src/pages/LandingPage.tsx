import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { 
  Zap, Clock, BarChart3, ArrowRight, 
  Building2, Heart, Landmark, Star, Shield, Smartphone
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { useEffect, useState } from 'react'

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 }
}

const staggerContainer = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
}

function AnimatedCounter({ end, duration = 2000, suffix = '' }: { end: number; duration?: number; suffix?: string }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let startTime: number | null = null
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      setCount(Math.floor(progress * end))
      if (progress < 1) requestAnimationFrame(animate)
    }
    requestAnimationFrame(animate)
  }, [end, duration])

  return <span>{count.toLocaleString()}{suffix}</span>
}

function LiveQueuePreview() {
  const [currentServing, setCurrentServing] = useState(18)
  const [waiting, setWaiting] = useState(12)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentServing(prev => (prev >= 30 ? 1 : prev + 1))
      setWaiting(prev => Math.max(1, prev + (Math.random() > 0.5 ? 1 : -1)))
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="relative"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-3xl blur-3xl" />
      <Card className="relative glass-card border-primary/20 p-8 overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-24 h-24 bg-secondary/10 rounded-full translate-y-1/2 -translate-x-1/2" />
        
        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-6">
            <div className="w-3 h-3 rounded-full bg-success animate-pulse" />
            <span className="text-sm font-medium text-muted-foreground">Live Queue Status</span>
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            <div className="text-center p-4 rounded-xl bg-muted/50">
              <p className="text-sm text-muted-foreground mb-1">Now Serving</p>
              <motion.p 
                key={currentServing}
                initial={{ scale: 1.2, color: 'hsl(var(--primary))' }}
                animate={{ scale: 1, color: 'hsl(var(--foreground))' }}
                className="text-4xl font-bold"
              >
                A{currentServing.toString().padStart(2, '0')}
              </motion.p>
            </div>
            <div className="text-center p-4 rounded-xl bg-muted/50">
              <p className="text-sm text-muted-foreground mb-1">Waiting</p>
              <motion.p 
                key={waiting}
                initial={{ scale: 1.1 }}
                animate={{ scale: 1 }}
                className="text-4xl font-bold"
              >
                {waiting}
              </motion.p>
            </div>
          </div>
          
          <div className="mt-6 flex items-center justify-center gap-2">
            <span className="text-sm text-muted-foreground">Avg. wait time:</span>
            <span className="text-sm font-semibold text-primary">~8 mins</span>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

export function LandingPage() {
  const features = [
    { icon: Clock, title: 'Real-time Updates', desc: 'Get instant notifications when your turn approaches' },
    { icon: Smartphone, title: 'Mobile First', desc: 'Access your queue status from any device, anywhere' },
    { icon: BarChart3, title: 'Smart Analytics', desc: 'Optimize operations with detailed queue insights' },
    { icon: Shield, title: 'Secure & Private', desc: 'Your data is encrypted and protected at all times' },
  ]

  const steps = [
    { num: '01', title: 'Select Service', desc: 'Choose from hospital, bank, or government services' },
    { num: '02', title: 'Join Queue', desc: 'Get your digital token with estimated wait time' },
    { num: '03', title: 'Get Notified', desc: 'Receive alerts when your turn is approaching' },
  ]

  const services = [
    { icon: Heart, name: 'Healthcare', color: 'bg-red-500/10 text-red-500' },
    { icon: Landmark, name: 'Banking', color: 'bg-blue-500/10 text-blue-500' },
    { icon: Building2, name: 'Government', color: 'bg-purple-500/10 text-purple-500' },
  ]

  const stats = [
    { value: 50000, suffix: '+', label: 'Customers Served' },
    { value: 95, suffix: '%', label: 'Satisfaction Rate' },
    { value: 45, suffix: '%', label: 'Wait Time Reduced' },
    { value: 500, suffix: '+', label: 'Organizations' },
  ]

  const testimonials = [
    { name: 'Dr. Sarah Chen', role: 'Hospital Director', text: 'SmartQueue reduced our patient wait times by 40%. The real-time analytics help us optimize staff allocation.' },
    { name: 'Michael Park', role: 'Bank Manager', text: 'Our customers love the digital queue system. No more crowded waiting rooms and frustrated clients.' },
    { name: 'Priya Sharma', role: 'Government Official', text: 'Implementing SmartQueue transformed our public service offices. Citizens can now wait comfortably anywhere.' },
  ]

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center hero-gradient overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-20 left-10 w-72 h-72 bg-primary/10 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-accent/5 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 pt-24 pb-16 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                <Zap className="w-4 h-4" />
                Smart Queue Management
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight mb-6">
                Wait Less.{' '}
                <span className="gradient-text">Serve Faster.</span>
                <br />
                Smarter Queues.
              </h1>
              
              <p className="text-lg text-muted-foreground mb-8 max-w-lg">
                Transform your waiting experience with intelligent queue management. 
                Real-time updates, digital tokens, and seamless service across healthcare, 
                banking, and government sectors.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <Link to="/join">
                  <Button variant="gradient" size="lg" className="gap-2">
                    Join Queue Now
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
                <Link to="/admin">
                  <Button variant="outline" size="lg">
                    View Demo
                  </Button>
                </Link>
              </div>
              
              <div className="flex items-center gap-6 mt-10">
                <div className="flex -space-x-3">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-secondary border-2 border-background" />
                  ))}
                </div>
                <div>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} className="w-4 h-4 fill-warning text-warning" />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground">Trusted by 50,000+ users</p>
                </div>
              </div>
            </motion.div>

            <LiveQueuePreview />
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <motion.p variants={fadeInUp} className="text-primary font-semibold mb-2">OUR SERVICES</motion.p>
            <motion.h2 variants={fadeInUp} className="text-3xl sm:text-4xl font-bold mb-4">
              Queue Solutions for Every Industry
            </motion.h2>
            <motion.p variants={fadeInUp} className="text-muted-foreground max-w-2xl mx-auto">
              From hospitals to banks to government offices, our smart queue system adapts to your needs
            </motion.p>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-6"
          >
            {services.map((service, i) => (
              <motion.div key={i} variants={fadeInUp}>
                <Card className="group hover:shadow-xl hover:-translate-y-2 transition-all duration-300 cursor-pointer border-transparent hover:border-primary/20">
                  <CardContent className="p-8 text-center">
                    <div className={`w-16 h-16 rounded-2xl ${service.color} flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform`}>
                      <service.icon className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold mb-2">{service.name}</h3>
                    <p className="text-muted-foreground text-sm">Streamlined queue management tailored for {service.name.toLowerCase()} sector needs</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.p variants={fadeInUp} className="text-primary font-semibold mb-2">HOW IT WORKS</motion.p>
            <motion.h2 variants={fadeInUp} className="text-3xl sm:text-4xl font-bold mb-4">
              Three Simple Steps
            </motion.h2>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-8"
          >
            {steps.map((step, i) => (
              <motion.div key={i} variants={fadeInUp} className="relative">
                {i < steps.length - 1 && (
                  <div className="hidden md:block absolute top-12 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-primary/50 to-transparent" />
                )}
                <div className="text-center">
                  <div className="w-24 h-24 rounded-full gradient-bg flex items-center justify-center mx-auto mb-6 shadow-glow">
                    <span className="text-2xl font-bold text-primary-foreground">{step.num}</span>
                  </div>
                  <h3 className="text-xl font-bold mb-2">{step.title}</h3>
                  <p className="text-muted-foreground">{step.desc}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-20 hero-gradient">
        <div className="container mx-auto px-4">
          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.p variants={fadeInUp} className="text-primary font-semibold mb-2">FEATURES</motion.p>
            <motion.h2 variants={fadeInUp} className="text-3xl sm:text-4xl font-bold mb-4">
              Why Choose SmartQueue?
            </motion.h2>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {features.map((feature, i) => (
              <motion.div key={i} variants={fadeInUp}>
                <Card className="h-full glass-card hover:shadow-xl transition-all duration-300 group">
                  <CardContent className="p-6">
                    <div className="w-12 h-12 rounded-xl gradient-bg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                      <feature.icon className="w-6 h-6 text-primary-foreground" />
                    </div>
                    <h3 className="text-lg font-bold mb-2">{feature.title}</h3>
                    <p className="text-muted-foreground text-sm">{feature.desc}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-8"
          >
            {stats.map((stat, i) => (
              <motion.div key={i} variants={fadeInUp} className="text-center">
                <p className="text-4xl sm:text-5xl font-extrabold gradient-text mb-2">
                  <AnimatedCounter end={stat.value} suffix={stat.suffix} />
                </p>
                <p className="text-muted-foreground font-medium">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.p variants={fadeInUp} className="text-primary font-semibold mb-2">TESTIMONIALS</motion.p>
            <motion.h2 variants={fadeInUp} className="text-3xl sm:text-4xl font-bold mb-4">
              What Our Users Say
            </motion.h2>
          </motion.div>

          <motion.div 
            variants={staggerContainer}
            initial="initial"
            whileInView="animate"
            viewport={{ once: true }}
            className="grid md:grid-cols-3 gap-6"
          >
            {testimonials.map((t, i) => (
              <motion.div key={i} variants={fadeInUp}>
                <Card className="h-full hover:shadow-xl transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-center gap-1 mb-4">
                      {[1, 2, 3, 4, 5].map((s) => (
                        <Star key={s} className="w-4 h-4 fill-warning text-warning" />
                      ))}
                    </div>
                    <p className="text-muted-foreground mb-6">"{t.text}"</p>
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-full gradient-bg" />
                      <div>
                        <p className="font-semibold">{t.name}</p>
                        <p className="text-sm text-muted-foreground">{t.role}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="relative overflow-hidden rounded-3xl gradient-bg p-12 text-center"
          >
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full translate-y-1/2 -translate-x-1/2" />
            </div>
            <div className="relative z-10">
              <h2 className="text-3xl sm:text-4xl font-bold text-primary-foreground mb-4">
                Ready to Transform Your Queue?
              </h2>
              <p className="text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
                Join thousands of organizations already using SmartQueue to deliver 
                better service and happier customers.
              </p>
              <Link to="/join">
                <Button size="lg" className="bg-background text-foreground hover:bg-background/90 gap-2">
                  Get Started Free
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-border">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-xl gradient-bg flex items-center justify-center">
                <Zap className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold gradient-text">SmartQueue</span>
            </div>
            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <a href="#" className="hover:text-foreground transition-colors">Privacy</a>
              <a href="#" className="hover:text-foreground transition-colors">Terms</a>
              <a href="#" className="hover:text-foreground transition-colors">Contact</a>
            </div>
            <p className="text-sm text-muted-foreground">
              2025 SmartQueue. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
