"use client"

import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function Terms() {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />

      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground mb-4 inline-block">
            ← Back to home
          </Link>
          <h1 className="text-4xl font-bold text-foreground mb-2">Terms of Service</h1>
          <p className="text-muted-foreground mb-8">Last updated: November 2025</p>

          <div className="space-y-8">
            <Card className="border-border">
              <CardHeader>
                <CardTitle>1. Acceptance of Terms</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                <p>
                  By accessing TechBridge, you agree to comply with these terms and conditions. If you disagree with any
                  part, please discontinue use.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader>
                <CardTitle>2. User Responsibilities</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>Users agree to:</p>
                <ul className="list-disc list-inside space-y-2">
                  <li>Provide accurate and truthful information</li>
                  <li>Respect other community members</li>
                  <li>Use devices for legitimate purposes only</li>
                  <li>Report fraudulent or inappropriate activity</li>
                  <li>Comply with all applicable laws</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader>
                <CardTitle>3. Device Liability</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>
                  Devices are provided on an "as-is" basis. Contributors are not liable for device functionality issues
                  that arise after transfer. Recipients must verify devices meet their needs before accepting.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader>
                <CardTitle>4. Verification Requirements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-muted-foreground">
                <p>
                  To ensure community safety, all users must complete verification with valid identification. Requests
                  and contributions from unverified accounts are marked as pending.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader>
                <CardTitle>5. Dispute Resolution</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                <p>
                  Disputes between users should be resolved directly. TechBridge reserves the right to remove users who
                  violate our community guidelines or engage in fraudulent activity.
                </p>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader>
                <CardTitle>6. Limitation of Liability</CardTitle>
              </CardHeader>
              <CardContent className="text-muted-foreground">
                <p>
                  TechBridge is not responsible for losses or damages arising from device transfers or user
                  interactions. Use the platform at your own risk.
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
