"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { storage } from "@/lib/storage"
import { ArrowLeft, AlertCircle } from "lucide-react"
import Link from "next/link"
import { VerificationModal } from "@/components/verification-modal"

export default function ContributorSignIn() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [contributorType, setContributorType] = useState<"individual" | "organization">("individual")
  const [organizationName, setOrganizationName] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const [showVerification, setShowVerification] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      if (!name.trim()) {
        setError("Name is required")
        return
      }
      if (!email.trim()) {
        setError("Email is required")
        return
      }
      if (contributorType === "organization" && !organizationName.trim()) {
        setError("Organization name is required")
        return
      }

      const userData = await storage.createUser({
        name,
        email,
        type: "contributor",
        organization: contributorType === "organization" ? organizationName : undefined,
        verified: false,
      })

      const session = {
        id: userData.id,
        type: "contributor" as const,
        name,
        email,
        organization: contributorType === "organization" ? organizationName : undefined,
        verified: false,
      }

      storage.setSession(session)
      setShowVerification(true)
    } catch (err) {
      setError("An error occurred. Please try again.")
      console.error(err)
    } finally {
      setLoading(false)
    }
  }

  const handleVerificationComplete = () => {
    router.push("/dashboard/contributor")
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 text-sm transition"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to home
        </Link>

        <Card className="border border-border">
          <CardHeader className="text-center">
            <CardTitle className="text-2xl">Become a Partner</CardTitle>
            <CardDescription>Help solve the digital divide</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              {error && (
                <div className="flex gap-3 bg-red-500/10 border border-red-500/20 rounded-lg p-3">
                  <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-500">{error}</p>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="type" className="text-sm font-medium">
                  Partner Type
                </Label>
                <Select value={contributorType} onValueChange={(value: any) => setContributorType(value)}>
                  <SelectTrigger id="type" className="bg-input border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    <SelectItem value="individual">Individual Sponsor</SelectItem>
                    <SelectItem value="organization">Organization / Charity</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium">
                  {contributorType === "organization" ? "Contact Person Name" : "Full Name"}
                </Label>
                <Input
                  id="name"
                  placeholder={contributorType === "organization" ? "Jane Smith" : "Jane Smith"}
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={loading}
                  className="bg-input border-border focus:ring-1"
                />
              </div>

              {contributorType === "organization" && (
                <div className="space-y-2 animate-in fade-in">
                  <Label htmlFor="organization" className="text-sm font-medium">
                    Organization Name
                  </Label>
                  <Input
                    id="organization"
                    placeholder="Tech for Good Charity"
                    value={organizationName}
                    onChange={(e) => setOrganizationName(e.target.value)}
                    disabled={loading}
                    className="bg-input border-border focus:ring-1"
                  />
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="jane@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  className="bg-input border-border focus:ring-1"
                />
              </div>

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
              >
                {loading ? "Creating account..." : "Join as Partner"}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-border">
              <p className="text-xs text-muted-foreground text-center mb-3 uppercase tracking-wide">
                Looking for devices?
              </p>
              <Link href="/auth/signin" className="block">
                <Button variant="outline" className="w-full border-border hover:bg-card bg-transparent">
                  User / Organization Sign In
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      <VerificationModal open={showVerification} onComplete={handleVerificationComplete} />
    </div>
  )
}
