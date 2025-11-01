"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { storage } from "@/lib/storage"
import { Upload, AlertCircle } from "lucide-react"
import Link from "next/link"

export default function AddDevice() {
  const router = useRouter()
  const [session, setSession] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [imagePreview, setImagePreview] = useState("")
  const [fileName, setFileName] = useState("")
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null)
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    condition: "good" as const,
    description: "",
    image: "",
  })

  useEffect(() => {
    const userSession = storage.getSession()
    if (!userSession || userSession.type !== "contributor") {
      router.push("/")
      return
    }
    setSession(userSession)

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          })
        },
        () => console.log("Location access denied"),
      )
    }
  }, [router])

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFileName(file.name)
      const reader = new FileReader()
      reader.onload = (event) => {
        const data = event.target?.result as string
        setFormData({ ...formData, image: data })
        setImagePreview(data)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!session) return

    setLoading(true)
    try {
      if (!formData.name.trim() || !formData.type.trim() || !formData.description.trim()) {
        alert("Please fill in all required fields")
        return
      }

      await storage.addDevice({
        name: formData.name,
        type: formData.type,
        condition: formData.condition,
        description: formData.description,
        image_url: formData.image,
        contributor_id: session.id,
        latitude: userLocation?.latitude,
        longitude: userLocation?.longitude,
        available: true,
      })

      router.push("/dashboard/contributor/my-devices")
    } catch (error) {
      console.error("Error adding device:", error)
      alert("Error adding device")
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
          {/* Header */}
          <div className="mb-8">
            <Link
              href="/dashboard/contributor"
              className="text-sm text-muted-foreground hover:text-foreground mb-4 inline-block"
            >
              ← Back to Dashboard
            </Link>
            <h1 className="text-4xl font-bold text-foreground mb-2">Add New Device</h1>
            <p className="text-muted-foreground">Contribute a device to the TechBridge network</p>
          </div>

          {/* Verification Alert */}
          {!session.verified && (
            <Card className="mb-8 border-amber-500/20 bg-amber-500/5">
              <CardContent className="pt-6 flex items-start gap-4">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-amber-600">Device Contribution Pending Verification</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    This device will be marked as pending until your account is verified.{" "}
                    <Link href="/account/verify" className="underline hover:no-underline">
                      Verify now
                    </Link>
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          <Card className="border-border">
            <CardHeader>
              <CardTitle>Device Information</CardTitle>
              <CardDescription>Provide details about the device you're contributing</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Image Upload */}
                <div className="space-y-3">
                  <Label htmlFor="device-image" className="text-base font-semibold">
                    Device Image
                  </Label>
                  <p className="text-sm text-muted-foreground">Upload a clear photo of your device</p>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="device-image-input"
                    disabled={loading}
                  />
                  <label
                    htmlFor="device-image-input"
                    className="flex flex-col items-center justify-center gap-3 w-full p-8 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition"
                  >
                    {imagePreview ? (
                      <>
                        <img
                          src={imagePreview || "/placeholder.svg"}
                          alt="Preview"
                          className="w-full max-h-48 object-cover rounded"
                        />
                        <p className="text-xs text-green-600 font-medium">{fileName}</p>
                      </>
                    ) : (
                      <>
                        <Upload className="w-8 h-8 text-muted-foreground" />
                        <div className="text-center">
                          <p className="text-sm font-medium text-foreground">Click to upload or drag and drop</p>
                          <p className="text-xs text-muted-foreground mt-1">PNG, JPG, or GIF (max 10MB)</p>
                        </div>
                      </>
                    )}
                  </label>
                </div>

                {/* Device Details */}
                <div className="space-y-3">
                  <Label htmlFor="device-name" className="text-base font-semibold">
                    Device Name <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="device-name"
                    placeholder="e.g., MacBook Pro 2019"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    disabled={loading}
                    className="bg-input border-border focus:ring-1"
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="device-type" className="text-base font-semibold">
                    Device Type <span className="text-red-500">*</span>
                  </Label>
                  <Input
                    id="device-type"
                    placeholder="e.g., Laptop, Tablet, Monitor, Phone"
                    value={formData.type}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    disabled={loading}
                    className="bg-input border-border focus:ring-1"
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="device-condition" className="text-base font-semibold">
                    Condition <span className="text-red-500">*</span>
                  </Label>
                  <Select
                    value={formData.condition}
                    onValueChange={(value: any) => setFormData({ ...formData, condition: value })}
                  >
                    <SelectTrigger id="device-condition" className="bg-input border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border">
                      <SelectItem value="excellent">Excellent - Like New</SelectItem>
                      <SelectItem value="good">Good - Minor Wear</SelectItem>
                      <SelectItem value="fair">Fair - Cosmetic Damage</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="device-description" className="text-base font-semibold">
                    Description <span className="text-red-500">*</span>
                  </Label>
                  <p className="text-sm text-muted-foreground">Describe the device, features, and condition</p>
                  <Textarea
                    id="device-description"
                    placeholder="Include details about the device, its condition, any repairs needed, working condition, etc."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    disabled={loading}
                    className="min-h-32 bg-input border-border focus:ring-1 resize-none"
                  />
                </div>

                {userLocation && (
                  <div className="p-4 bg-blue-500/5 border border-blue-500/20 rounded-lg">
                    <p className="text-xs text-blue-600 font-medium">
                      Location enabled • Device will be visible on map
                    </p>
                  </div>
                )}

                {/* Submit */}
                <div className="flex gap-4 pt-4 border-t border-border">
                  <Link href="/dashboard/contributor" className="flex-1">
                    <Button variant="outline" className="w-full border-border bg-transparent" disabled={loading}>
                      Cancel
                    </Button>
                  </Link>
                  <Button type="submit" disabled={loading} className="flex-1 bg-primary hover:bg-primary/90">
                    {loading ? "Adding Device..." : "Add Device"}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}
