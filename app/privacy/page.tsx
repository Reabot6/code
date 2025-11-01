"use client"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function Privacy() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />

      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground mb-4 inline-block">
            ← Back to home
          </Link>
          <h1 className="text-4xl font-bold text-foreground mb-2">Privacy Policy</h1>
          <p className="text-muted-foreground mb-8">Last updated: November 2025</p>

          <div className="space-y-8">
            <Card className="border-border">
              <CardHeader>
                <CardTitle>1. Information We Collect</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>
                  We collect information you provide directly, such as your name, email, location, and device details
                  when you create an account or submit requests.
                </p>
                <p>
                  Location data is collected with your explicit consent to match you with devices and contributors near
                  you.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader>
                <CardTitle>2. How We Use Your Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>We use your information to:</p>
                <ul className="list-disc list-inside space-y-2">
                  <li>Match you with relevant devices and contributors</li>
                  <li>Process requests and communications</li>
                  <li>Verify accounts and prevent fraud</li>
                  <li>Improve our platform and services</li>
                  <li>Send updates and notifications</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader>
                <CardTitle>3. Data Security</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                <p>
                  We implement industry-standard security measures to protect your personal information. However, no
                  method of transmission over the internet is 100% secure.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader>
                <CardTitle>4. Your Rights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>You have the right to:</p>
                <ul className="list-disc list-inside space-y-2">
                  <li>Access your personal information</li>
                  <li>Request corrections or deletions</li>
                  <li>Opt-out of communications</li>
                  <li>Request data portability</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader>
                <CardTitle>5. Contact Us</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                <p>
                  For privacy concerns, contact us at{" "}
                  <a href="mailto:privacy@techbridge.com" className="text-primary hover:underline">
                    privacy@techbridge.com
                  </a>
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}
