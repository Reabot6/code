"use client"

import type React from "react"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Mail, MapPin, Github } from "lucide-react"
import { useState } from "react"
import Link from "next/link"

export default function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" })
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => setSubmitted(false), 3000)
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />

      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground mb-4 inline-block">
            ← Back to home
          </Link>
          <h1 className="text-4xl font-bold text-foreground mb-2">Get in Touch</h1>
          <p className="text-muted-foreground mb-12">
            Have questions or want to partner with us? We'd love to hear from you.
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="border-border">
              <CardHeader>
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-3">
                  <Mail className="w-5 h-5 text-primary" />
                </div>
                <CardTitle className="text-lg">Email</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                <p className="text-sm mb-2">
                  <a href="mailto:onimisiadeolu@gmail.com" className="text-primary hover:underline">
                    onimisiadeolu@gmail.com
                  </a>
                </p>
                <p className="text-xs">We typically respond within 24 hours</p>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader>
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-3">
                  <Github className="w-5 h-5 text-primary" />
                </div>
                <CardTitle className="text-lg">GitHub</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                <p className="text-sm mb-2">
                  <a
                    href="https://github.com/Reabot6"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline"
                  >
                    @Reabot6
                  </a>
                </p>
                <p className="text-xs">Contribute to our open-source project</p>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader>
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center mb-3">
                  <MapPin className="w-5 h-5 text-primary" />
                </div>
                <CardTitle className="text-lg">Community</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                <p className="text-sm mb-2">Global</p>
                <p className="text-xs">Join our mission to close the digital divide</p>
              </CardContent>
            </Card>
          </div>

          <Card className="border-border max-w-2xl">
            <CardHeader>
              <CardTitle>Send us a Message</CardTitle>
              <CardDescription>We'll get back to you as soon as possible</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <Input
                      id="name"
                      placeholder="Your name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="bg-input border-border"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@email.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="bg-input border-border"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    placeholder="How can we help?"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="bg-input border-border"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <Textarea
                    id="message"
                    placeholder="Tell us more..."
                    rows={5}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="bg-input border-border"
                  />
                </div>

                <Button type="submit" className="w-full bg-primary hover:bg-primary/90">
                  {submitted ? "Message Sent!" : "Send Message"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}
