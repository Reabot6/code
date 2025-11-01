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

export default function SignIn() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [userType, setUserType] = useState<"user" | "organization">("user")
  const [organization, setOrganization] = useState("")
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
      if (userType === "organization" && !organization.trim()) {
        setError("Organization name is required")
        return
      }

      const userData = await storage.createUser({
        name,
        email,
        type: userType,
        organization: userType === "organization" ? organization : undefined,
        verified: false,
      })

      const session = {
        id: userData.id,
        type: userType,
        name,
        email,
        organization: userType === "organization" ? organization : undefined,
        verified: false,
      }

      storage.setSession(session)
      setShowVerification(true)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An error occurred. Please try again."
      setError(errorMessage)
      console.error("[v0] Error in handleSubmit:", err)
    } finally {
      setLoading(false)
    }
  }

  const handleVerificationComplete = () => {
    router.push("/dashboard")
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
            <CardTitle className="text-2xl">Sign In</CardTitle>
            <CardDescription>Create or access your account</CardDescription>
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
                <Label htmlFor="name" className="text-sm font-medium">
                  Full Name
                </Label>
                <Input
                  id="name"
                  placeholder="John Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  disabled={loading}
                  className="bg-input border-border focus:ring-1"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="john@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  className="bg-input border-border focus:ring-1"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="type" className="text-sm font-medium">
                  Account Type
                </Label>
                <Select value={userType} onValueChange={(value: any) => setUserType(value)}>
                  <SelectTrigger id="type" className="bg-input border-border">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border">
                    <SelectItem value="user">Individual User</SelectItem>
                    <SelectItem value="organization">Organization</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {userType === "organization" && (
                <div className="space-y-2 animate-in fade-in">
                  <Label htmlFor="organization" className="text-sm font-medium">
                    Organization Name
                  </Label>
                  <Input
                    id="organization"
                    placeholder="Tech for Good Inc."
                    value={organization}
                    onChange={(e) => setOrganization(e.target.value)}
                    disabled={loading}
                    className="bg-input border-border focus:ring-1"
                  />
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium"
              >
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-border">
              <p className="text-xs text-muted-foreground text-center mb-3 uppercase tracking-wide">
                Contributing devices?
              </p>
              <Link href="/auth/contributor" className="block">
                <Button variant="outline" className="w-full border-border hover:bg-card bg-transparent">
                  Become a Partner
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
