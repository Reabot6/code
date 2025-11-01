"use client"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Recycle, Users, Heart, TrendingUp, Globe, Shield } from "lucide-react"
import Link from "next/link"

export default function Mission() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />

      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          {/* Hero Section */}
          <div className="mb-16">
            <Link href="/" className="text-sm text-muted-foreground hover:text-foreground mb-4 inline-block">
              ← Back to home
            </Link>
            <h1 className="text-5xl font-bold text-foreground mb-4">Our Mission</h1>
            <p className="text-xl text-muted-foreground mb-8">
              Closing the digital divide, one device at a time. Everyone deserves access to technology.
            </p>
          </div>

          {/* Mission Statement */}
          <Card className="border-border mb-12">
            <CardHeader>
              <CardTitle className="text-2xl">Solving the Digital Divide</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4 text-muted-foreground">
              <p>
                The digital divide isn't just about technology access—it's about opportunity. Millions of people
                worldwide lack access to devices needed for education, healthcare, employment, and personal growth.
                Meanwhile, billions of devices sit unused or discarded.
              </p>
              <p>
                TechBridge connects these two worlds. We believe that everyone, regardless of economic status, deserves
                access to technology. The little things matter—a refurbished laptop can change a student's academic
                trajectory, a tablet can help a senior stay connected with family, a smartphone can open doors to
                opportunity.
              </p>
              <p>
                You don't need to be wealthy to make an impact. Whether you're an individual with an old device, a tech
                company with surplus inventory, or a charity dedicated to social impact, you can be part of the
                solution.
              </p>
            </CardContent>
          </Card>

          {/* Core Values */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-8">Our Core Values</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="border-border">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                      <Recycle className="w-5 h-5 text-green-600" />
                    </div>
                    <CardTitle className="text-lg">Sustainability</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  Reduce e-waste and environmental impact by extending device lifecycles and giving technology a second
                  life.
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-blue-500/10 rounded-lg flex items-center justify-center">
                      <Users className="w-5 h-5 text-blue-600" />
                    </div>
                    <CardTitle className="text-lg">Community</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  Build a global community united by the belief that technology access is a basic right, not a
                  privilege.
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-red-500/10 rounded-lg flex items-center justify-center">
                      <Heart className="w-5 h-5 text-red-600" />
                    </div>
                    <CardTitle className="text-lg">Equity</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  Prioritize reaching underserved communities, students, seniors, and those facing financial hardship.
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardHeader>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 bg-purple-500/10 rounded-lg flex items-center justify-center">
                      <Shield className="w-5 h-5 text-purple-600" />
                    </div>
                    <CardTitle className="text-lg">Trust</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="text-sm text-muted-foreground">
                  Maintain transparency, security, and accountability in all transactions and community interactions.
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Impact Areas */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-foreground mb-8">Our Impact Areas</h2>
            <div className="space-y-4">
              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Globe className="w-5 h-5 text-primary" />
                    Education Access
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground">
                  Providing students, especially in underserved regions, with devices for online learning, research, and
                  skill development.
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="w-5 h-5 text-primary" />
                    Healthcare Connectivity
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground">
                  Enabling telehealth access, medication reminders, and health information resources for vulnerable
                  populations.
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="w-5 h-5 text-primary" />
                    Employment Opportunities
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-muted-foreground">
                  Supporting job seekers with tools to access employment platforms, build digital portfolios, and
                  develop tech skills.
                </CardContent>
              </Card>
            </div>
          </div>

          {/* CTA */}
          <Card className="border-border bg-primary/5">
            <CardContent className="pt-8 text-center">
              <h3 className="text-2xl font-bold text-foreground mb-3">Ready to Make a Difference?</h3>
              <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
                Every device matters. Every person deserves a chance. Join our community of partners and sponsors today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/auth/contributor">
                  <Button className="bg-primary hover:bg-primary/90">Become a Partner</Button>
                </Link>
                <Link href="/auth/signin">
                  <Button variant="outline" className="border-border bg-transparent">
                    Request a Device
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}
