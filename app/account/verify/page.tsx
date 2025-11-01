"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { storage } from "@/lib/storage"
import { AlertCircle, CheckCircle2, Upload, ArrowLeft } from "lucide-react"
import Link from "next/link"

export default function VerifyAccount() {
  const router = useRouter()
  const [session, setSession] = useState<any>(null)
  const [fileName, setFileName] = useState("")
  const [imageData, setImageData] = useState<string>("")
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const userSession = storage.getSession()
    if (!userSession) {
      router.push("/")
      return
    }
    setSession(userSession)
  }, [router])

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFileName(file.name)
      const reader = new FileReader()
      reader.onload = (event) => {
        const data = event.target?.result as string
        setImageData(data)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleVerify = () => {
    if (!imageData) return
    setLoading(true)
    try {
      storage.updateSession({
        verified: true,
        verificationImage: imageData,
      })
      setSession(storage.getSession())
    } finally {
      setLoading(false)
    }
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />

      <main className="flex-1">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <Link
            href={session.type === "contributor" ? "/dashboard/contributor" : "/dashboard"}
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 text-sm transition"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Link>

          {session.verified ? (
            <Card className="border-border">
              <CardHeader className="text-center pt-12 pb-8">
                <div className="flex justify-center mb-4">
                  <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center">
                    <CheckCircle2 className="w-8 h-8 text-green-600" />
                  </div>
                </div>
                <CardTitle className="text-2xl">Account Verified</CardTitle>
                <CardDescription className="mt-2">
                  Your account has been verified. You now have full access to all features.
                </CardDescription>
              </CardHeader>
              <CardContent className="pb-8">
                <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-6 space-y-4 mb-6">
                  <div className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <p className="font-medium text-foreground text-sm">All requests and contributions</p>
                      <p className="text-xs text-muted-foreground mt-1">will now be processed normally</p>
                    </div>
                  </div>
                </div>
                <Button
                  onClick={() => router.push(session.type === "contributor" ? "/dashboard/contributor" : "/dashboard")}
                  className="w-full bg-primary hover:bg-primary/90"
                >
                  Return to Dashboard
                </Button>
              </CardContent>
            </Card>
          ) : (
            <Card className="border-border">
              <CardHeader>
                <CardTitle className="text-2xl">Verify Your Account</CardTitle>
                <CardDescription>Submit your legal identification to unlock full access to TechBridge</CardDescription>
              </CardHeader>
              <CardContent className="space-y-8">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="font-semibold text-foreground mb-4 text-sm">Why Verify?</h3>
                    <ul className="space-y-3">
                      <li className="flex gap-3">
                        <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-muted-foreground">Process requests immediately</span>
                      </li>
                      <li className="flex gap-3">
                        <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-muted-foreground">Contribute devices without pending</span>
                      </li>
                      <li className="flex gap-3">
                        <CheckCircle2 className="w-4 h-4 text-green-600 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-muted-foreground">Full community access</span>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-semibold text-foreground mb-4 text-sm">Accepted Documents</h3>
                    <ul className="space-y-2 text-sm text-muted-foreground">
                      <li className="flex gap-2">
                        <span className="text-primary">•</span> Government-issued ID
                      </li>
                      <li className="flex gap-2">
                        <span className="text-primary">•</span> Passport
                      </li>
                      <li className="flex gap-2">
                        <span className="text-primary">•</span> Driver's License
                      </li>
                      <li className="flex gap-2">
                        <span className="text-primary">•</span> Any legal identification
                      </li>
                    </ul>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-4 text-sm">Upload Identification</h3>
                  <div className="relative">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="verification-upload"
                      disabled={loading}
                    />
                    <label
                      htmlFor="verification-upload"
                      className="flex flex-col items-center justify-center gap-3 w-full p-12 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition"
                    >
                      {imageData ? (
                        <>
                          <img
                            src={imageData || "/placeholder.svg"}
                            alt="Preview"
                            className="w-full max-h-40 object-cover rounded"
                          />
                          <p className="text-xs text-green-600 font-medium">{fileName}</p>
                        </>
                      ) : (
                        <>
                          <Upload className="w-8 h-8 text-muted-foreground" />
                          <div className="text-center">
                            <p className="text-sm font-medium text-foreground">Click to upload or drag</p>
                            <p className="text-xs text-muted-foreground mt-1">PNG, JPG, or GIF (max 10MB)</p>
                          </div>
                        </>
                      )}
                    </label>
                  </div>
                </div>

                <div className="bg-amber-500/5 border border-amber-500/20 rounded-lg p-4 flex gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm font-medium text-amber-600">Privacy Notice</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Your identification is stored securely and never shared. We use it only for verification purposes.
                    </p>
                  </div>
                </div>

                <Button
                  onClick={handleVerify}
                  disabled={!imageData || loading}
                  className="w-full bg-primary hover:bg-primary/90"
                  size="lg"
                >
                  {loading ? "Verifying..." : "Verify Account"}
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
