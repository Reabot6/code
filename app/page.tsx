"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { 
  Smartphone, 
  Laptop, 
  Activity, 
  Stethoscope, 
  CheckCircle2, 
  ArrowRight, 
  Package, 
  Shield, 
  MapPin,
  Recycle,
  Clock,
  HeartHandshake
} from "lucide-react"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { toast } from "sonner"
import { motion } from "framer-motion"
import { Parallax } from "react-parallax"

interface ScrollElement {
  id: string
  inView: boolean
}

const fadeInUp = {
  initial: { opacity: 0, y: 60 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, ease: "easeOut" }
}

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.1
    }
  }
}

export default function Landing() {
  const router = useRouter()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userType, setUserType] = useState<string | null>(null)
  const [scrollElements, setScrollElements] = useState<ScrollElement[]>([
    { id: "hero", inView: true },
    { id: "mission", inView: false },
    { id: "how-it-works", inView: false },
    { id: "benefits", inView: false },
    { id: "impact", inView: false },
    { id: "cta", inView: false },
  ])

  useEffect(() => {
    const session = localStorage.getItem("techbridge_session")
    if (session) {
      try {
        const parsed = JSON.parse(session)
        setIsLoggedIn(true)
        setUserType(parsed.type)
      } catch (error) {
        console.error("[v0] Failed to parse session:", error)
        toast.error("Session error. Please sign in again.")
      }
    }
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      scrollElements.forEach((element) => {
        const el = document.getElementById(element.id)
        if (!el) return
        const rect = el.getBoundingClientRect()
        const isVisible = rect.top < window.innerHeight * 0.75 && rect.bottom > 0
        setScrollElements((prev) =>
          prev.map((item) => (item.id === element.id ? { ...item, inView: isVisible } : item))
        )
      })
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [scrollElements])

  const handleContinue = () => {
    try {
      if (userType === "contributor") {
        router.push("/dashboard/contributor")
      } else {
        router.push("/dashboard")
      }
    } catch (error) {
      console.error("[v0] Navigation error:", error)
      toast.error("Failed to navigate. Please try again.")
    }
  }

  if (isLoggedIn) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navigation />
        <div className="flex-1 flex items-center justify-center p-4">
          <Card className="w-full max-w-md">
            <CardHeader className="text-center">
              <CardTitle>Welcome back</CardTitle>
            </CardHeader>
            <CardContent>
              <Button onClick={handleContinue} className="w-full" size="lg">
                Go to Dashboard <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-card/30 flex flex-col">
      <Navigation />

      <main className="flex-1">
        {/* HERO - PARALLAX */}
        <Parallax bgImage="/images/" strength={400} className="min-h-screen">
          <section id="hero" className="relative min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8 py-20">
            <div className="max-w-5xl mx-auto w-full text-center space-y-8">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8 }}
              >
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20">
                  <span className="flex h-2 w-2 rounded-full bg-primary"></span>
                  <p className="text-sm font-medium text-primary">One unused device = one life quietly reconnected</p>
                </div>
              </motion.div>

              <motion.h1
                className="text-5xl sm:text-6xl lg:text-7xl font-bold text-foreground text-balance leading-tight"
                {...fadeInUp}
              >
                Your Old Phone Isn’t Junk —<br />
                <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  It’s Someone’s Next Breath
                </span>
              </motion.h1>

              <motion.p
                className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                A teenager in your city can’t submit homework because her laptop died. She’s not “needy” — she’s <strong>you, last year</strong>, before you upgraded.<br />
                A dad skips meals to save for a tablet his kid needs for speech therapy. Your spare one? It ends that hunger.<br />
                <strong>TechBridge</strong> doesn’t do charity. We do <strong>silent handoffs</strong> — no names, no photos, no savior complex.
              </motion.p>

              <motion.div
                className="flex flex-col sm:flex-row gap-4 justify-center pt-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <Button size="lg" onClick={() => router.push("/auth/signin")} className="gap-2">
                  I Need a Device (No Shame) <ArrowRight className="w-4 h-4" />
                </Button>
                <Button size="lg" variant="outline" onClick={() => router.push("/auth/contributor")} className="gap-2">
                  I Have One to Give (No Spotlight)
                </Button>
              </motion.div>

              <motion.div
                className="grid grid-cols-3 gap-6 pt-10"
                variants={stagger}
                initial="initial"
                animate="animate"
              >
                {[
                  { value: "5,234", label: "Devices moved from drawers to destinies" },
                  { value: "12,890", label: "People who got back online — no applause needed" },
                  { value: "58", label: "Cities where connection replaced isolation" }
                ].map((stat, i) => (
                  <motion.div key={i} variants={fadeInUp} className="text-center">
                    <p className="text-3xl sm:text-4xl font-bold text-foreground">{stat.value}</p>
                    <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
                  </motion.div>
                ))}
              </motion.div>
            </div>
          </section>
        </Parallax>

        {/* MISSION */}
        <section
          id="mission"
          className={`py-24 sm:py-32 px-4 sm:px-6 lg:px-8 transition-all duration-1000 ${
            scrollElements.find((el) => el.id === "mission")?.inView ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={stagger}
              className="grid md:grid-cols-2 gap-12 items-center"
            >
              <div className="space-y-6">
                <motion.p variants={fadeInUp} className="text-sm font-semibold text-primary uppercase tracking-wide">
                  This Isn’t Charity. This Is Flow.
                </motion.p>
                <motion.h2 variants={fadeInUp} className="text-3xl sm:text-4xl font-bold text-foreground">
                  Everyone Has Something They Don’t Use.<br />
                  <span className="text-primary">Everyone Has Something They Can’t Afford.</span>
                </motion.h2>
                <motion.p variants={fadeInUp} className="text-lg text-muted-foreground leading-relaxed">
                  You’re not “helping the poor.” You’re passing forward what you already replaced.<br /><br />
                  That iPad in the closet? A nurse uses it to check vitals on night shifts.<br />
                  That blood pressure monitor you never use? A senior tracks their health at home.<br />
                  <strong>No one meets. No one thanks you. No one posts your face.</strong><br />
                  We pick up. We sanitize. We deliver. You stay human. They stay human.
                </motion.p>
                <motion.ul variants={stagger} className="space-y-3 pt-4">
                  {["Clear your clutter", "Fuel someone’s grind", "Keep the cycle alive"].map((item, i) => (
                    <motion.li key={i} variants={fadeInUp} className="flex items-center gap-3">
                      <CheckCircle2 className="w-5 h-5 text-primary flex-shrink-0" />
                      <span className="text-muted-foreground">{item}</span>
                    </motion.li>
                  ))}
                </motion.ul>
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="relative h-96 rounded-2xl overflow-hidden "
              >
                <img src="/images/layer-devices.gif" alt="Devices in motion" className="absolute inset-0 w-full h-full object-contain opacity-70" />
              </motion.div>
            </motion.div>
          </div>
        </section>

        {/* HOW IT WORKS */}
        <section
          id="how-it-works"
          className={`py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-card/30 transition-all duration-1000 ${
            scrollElements.find((el) => el.id === "how-it-works")?.inView ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={stagger}
              className="text-center space-y-4 mb-16"
            >
              <motion.p variants={fadeInUp} className="text-sm font-semibold text-primary uppercase tracking-wide">
                Browse. Claim. Move On.
              </motion.p>
              <motion.h2 variants={fadeInUp} className="text-3xl sm:text-4xl font-bold text-foreground">
                Three Clicks. Zero Drama.
              </motion.h2>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  icon: Smartphone,
                  title: "Scroll the Stream",
                  desc: "Real devices. Real locations. “MacBook 2018 – for remote nursing school” | “BP Monitor – for home care”",
                  step: "01"
                },
                {
                  icon: Package,
                  title: "Say Why (One Sentence)",
                  desc: "“I’m a teacher. My projector died.” | “I code at night. My laptop overheats.” No sob stories. Just truth.",
                  step: "02"
                },
                {
                  icon: Shield,
                  title: "We Handle the Rest",
                  desc: "You drop at a locker. We sanitize. We deliver. No meetups. No guilt. No performance.",
                  step: "03"
                }
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.2 }}
                >
                  <Card className="h-full border-border/50 hover:border-primary/50 transition-all group">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div className="w-14 h-14 rounded-lg bg-primary/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <item.icon className="w-7 h-7 text-primary" />
                        </div>
                        <span className="text-3xl font-bold text-muted-foreground/30">{item.step}</span>
                      </div>
                      <CardTitle className="mt-4 group-hover:text-primary transition-colors">{item.title}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground leading-relaxed">{item.desc}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* BENEFITS */}
        <section
          id="benefits"
          className={`py-24 sm:py-32 px-4 sm:px-6 lg:px-8 transition-all duration-1000 ${
            scrollElements.find((el) => el.id === "benefits")?.inView ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={stagger}
              className="text-center space-y-4 mb-16"
            >
              <motion.p variants={fadeInUp} className="text-sm font-semibold text-primary uppercase tracking-wide">
                This Isn’t About Feeling Good.
              </motion.p>
              <motion.h2 variants={fadeInUp} className="text-3xl sm:text-4xl font-bold text-foreground">
                It’s About Keeping the World Running.
              </motion.h2>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { icon: Shield, title: "Anonymous Flow", desc: "You never see their face. They never see yours. Purity preserved." },
                { icon: MapPin, title: "Everyday People", desc: "Freelancers. Students. Night-shift workers. People like you, stuck one device short." },
                { icon: Clock, title: "Lightning Local", desc: "See a laptop 8 miles away? Request it. It’s yours by tomorrow." },
                { icon: HeartHandshake, title: "No Virtue Signal", desc: "We don’t post your donation. Your impact stays quiet. Your conscience screams." },
                { icon: Stethoscope, title: "Health Devices Too", desc: "BP monitors, glucose meters, pulse oximeters — if it helps someone live better, it belongs here." },
                { icon: Recycle, title: "Broken? Still Golden.", desc: "80% battery health? That’s luxury to someone on 12%." }
              ].map((b, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className="h-full bg-card/50 hover:bg-card border-border/50 hover:border-primary/50 transition-all">
                    <CardContent className="pt-6">
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                        <b.icon className="w-6 h-6 text-primary" />
                      </div>
                      <h3 className="font-semibold text-foreground mb-2">{b.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{b.desc}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* IMPACT */}
        <section
          id="impact"
          className={`py-24 sm:py-32 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-primary/5 to-primary/10 transition-all duration-1000 ${
            scrollElements.find((el) => el.id === "impact")?.inView ? "opacity-100" : "opacity-0"
          }`}
        >
          <div className="max-w-5xl mx-auto">
            <motion.div
              initial="initial"
              whileInView="animate"
              viewport={{ once: true }}
              variants={stagger}
              className="text-center space-y-4 mb-16"
            >
              <motion.p variants={fadeInUp} className="text-sm font-semibold text-primary uppercase tracking-wide">
                Numbers That Don’t Need Names
              </motion.p>
              <motion.h2 variants={fadeInUp} className="text-3xl sm:text-4xl font-bold text-foreground">
                Silent Wins. Loud Results.
              </motion.h2>
            </motion.div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { value: "5,234", label: "Devices → deadlines met", icon: Activity },
                { value: "12,890", label: "Lives → logins that worked", icon: HeartHandshake },
                { value: "450 tons", label: "E-Waste → planet lighter", icon: Recycle },
                { value: "58", label: "Hubs → access spreading", icon: MapPin }
              ].map((s, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="text-center"
                >
                  <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                    <s.icon className="w-8 h-8 text-primary" />
                  </div>
                  <p className="text-3xl sm:text-4xl font-bold text-foreground">{s.value}</p>
                  <p className="text-sm text-muted-foreground mt-1">{s.label}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA */}
        <section
          id="cta"
          className={`py-24 sm:py-32 px-4 sm:px-6 lg:px-8 transition-all duration-1000 ${
            scrollElements.find((el) => el.id === "cta")?.inView ? "opacity-100" : "opacity-0"
          }`}
        >
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto bg-gradient-to-br from-primary/10 to-primary/5 border border-primary/20 rounded-2xl p-8 sm:p-12 text-center space-y-8"
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-foreground">
              Your Spare Device Isn’t Waiting to Be Thrown Out —<br />
              <span className="text-primary">It’s Waiting to Be Picked Up</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-xl mx-auto">
              You don’t need to cry on camera. You need <strong>60 seconds</strong>.<br />
              Snap a photo. List it. Walk away.<br />
              We’ll get it to the graphic designer who can’t afford Adobe. To the kid learning Python on a crashing library PC.<br />
              <strong>That rush in your chest? That’s the sound of balance restoring itself.</strong>
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={() => router.push("/auth/signin")} className="gap-2">
                Show Me What’s Available <ArrowRight className="w-4 h-4" />
              </Button>
              <Button size="lg" variant="outline" onClick={() => router.push("/auth/contributor")} className="gap-2">
                List My Device (30 Seconds)
              </Button>
            </div>
          </motion.div>
        </section>
      </main>

      <Footer />
    </div>
  )
}