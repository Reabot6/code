"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { storage, type Device } from "@/lib/storage"
import { Plus, AlertCircle, MapPin } from "lucide-react"
import Link from "next/link"
import { MapComponent } from "@/components/map"
import { ReportDialog } from "@/components/report-dialog"

export default function BrowseDevices() {
  const router = useRouter()
  const [session, setSession] = useState<any>(null)
  const [devices, setDevices] = useState<Device[]>([])
  const [selectedDevice, setSelectedDevice] = useState<Device | null>(null)
  const [requestDescription, setRequestDescription] = useState("")
  const [urgency, setUrgency] = useState("medium")
  const [reason, setReason] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null)

  useEffect(() => {
    const userSession = storage.getSession()
    if (!userSession || userSession.type === "contributor") {
      router.push("/")
      return
    }
    setSession(userSession)

    // Get user location
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

    loadDevices()
  }, [router])

  const loadDevices = async () => {
    try {
      setLoading(true)
      const allDevices = await storage.getDevices()
      setDevices(allDevices || [])
    } catch (error) {
      console.error("Error loading devices:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleRequestDevice = (device: Device) => {
    setSelectedDevice(device)
    setRequestDescription("")
    setUrgency("medium")
    setReason("")
    setIsDialogOpen(true)
  }

  const submitRequest = async () => {
    if (!selectedDevice || !session) return

    setSubmitting(true)
    try {
      if (!requestDescription.trim()) {
        alert("Please describe why you need this device")
        setSubmitting(false)
        return
      }

      if (!urgency) {
        alert("Please select an urgency level")
        setSubmitting(false)
        return
      }

      if (!reason.trim()) {
        alert("Please explain the reason for urgency")
        setSubmitting(false)
        return
      }

      console.log("[v0] Submitting request with:", {
        device_id: selectedDevice.id,
        user_id: session.id,
        urgency,
        reason,
        description: requestDescription,
      })

      await storage.addRequest({
        device_id: selectedDevice.id,
        user_id: session.id,
        user_name: session.name,
        user_type: session.type,
        user_organization: session.organization,
        request_description: requestDescription.trim(),
        urgency: urgency,
        reason: reason.trim(),
        status: "pending",
        user_verified: session.verified,
      })

      console.log("[v0] Request submitted successfully")
      setIsDialogOpen(false)
      setSelectedDevice(null)
      setRequestDescription("")
      setUrgency("medium")
      setReason("")
      await loadDevices()
    } catch (error) {
      console.error("[v0] Error submitting request:", error)
      alert("Failed to submit request. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="mb-12">
            <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground mb-4 inline-block">
              ← Back to Dashboard
            </Link>
            <h1 className="text-4xl font-bold text-foreground mb-2">Available Devices</h1>
            <p className="text-muted-foreground">
              {loading ? "Loading..." : `${devices.length} device${devices.length !== 1 ? "s" : ""} available near you`}
            </p>
          </div>

          {/* Map Section */}
          {userLocation && devices.length > 0 && (
            <div className="mb-12">
              <div className="flex items-center gap-2 mb-4">
                <MapPin className="w-5 h-5 text-primary" />
                <h2 className="text-lg font-semibold text-foreground">Devices Near You</h2>
              </div>
              <MapComponent devices={devices} userLocation={userLocation} height="h-96" />
            </div>
          )}

          {/* Verification Notice */}
          {!session.verified && (
            <Card className="mb-8 border-amber-500/20 bg-amber-500/5">
              <CardContent className="pt-6 flex items-start gap-4">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-amber-600">Requests Pending Verification</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Your requests will be marked as pending until verified.{" "}
                    <Link href="/account/verify" className="underline hover:no-underline">
                      Verify now
                    </Link>
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {loading ? (
            <Card className="border-border">
              <CardContent className="pt-12 pb-8 text-center">
                <p className="text-muted-foreground">Loading devices...</p>
              </CardContent>
            </Card>
          ) : devices.length === 0 ? (
            <Card className="border-border">
              <CardContent className="pt-12 pb-8 text-center">
                <p className="text-muted-foreground mb-2">No devices available yet.</p>
                <p className="text-sm text-muted-foreground">Partners will add devices soon. Check back later!</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {devices.map((device) => (
                <Card
                  key={device.id}
                  className="border-border overflow-hidden hover:border-primary/50 transition flex flex-col"
                >
                  {device.image_url && (
                    <div className="w-full h-48 bg-card border-b border-border overflow-hidden">
                      <img
                        src={device.image_url || "/placeholder.svg"}
                        alt={device.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1">
                        <CardTitle className="text-lg">{device.name}</CardTitle>
                        <CardDescription>{device.type}</CardDescription>
                      </div>
                      <span
                        className={`text-xs px-2.5 py-1 rounded-full font-medium whitespace-nowrap ml-2 ${
                          device.condition === "excellent"
                            ? "bg-green-500/10 text-green-600 border border-green-500/20"
                            : device.condition === "good"
                              ? "bg-blue-500/10 text-blue-600 border border-blue-500/20"
                              : "bg-amber-500/10 text-amber-600 border border-amber-500/20"
                        }`}
                      >
                        {device.condition}
                      </span>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1 pb-4">
                    <p className="text-sm text-muted-foreground mb-6">{device.description}</p>
                    <div className="space-y-3 text-xs border-t border-border pt-4">
                      <p className="text-muted-foreground">
                        <span className="font-medium">From:</span> {device.contributor_name}
                      </p>
                      <p className="text-muted-foreground">
                        <span className="font-medium">Added:</span> {device.created_at?.split("T")[0]}
                      </p>
                    </div>
                  </CardContent>
                  <div className="px-6 pb-6 flex gap-2">
                    <Dialog open={isDialogOpen && selectedDevice?.id === device.id} onOpenChange={setIsDialogOpen}>
                      <DialogTrigger asChild>
                        <Button
                          className="flex-1 gap-2 bg-primary hover:bg-primary/90"
                          onClick={() => handleRequestDevice(device)}
                        >
                          <Plus className="w-4 h-4" />
                          Request
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-md border-border bg-card">
                        <DialogHeader>
                          <DialogTitle>Request Device</DialogTitle>
                          <DialogDescription>Submit your request for {selectedDevice?.name}</DialogDescription>
                        </DialogHeader>
                        <div className="space-y-5 py-6">
                          <div>
                            <Label className="text-sm font-medium">Device</Label>
                            <p className="text-foreground mt-2 text-sm">{selectedDevice?.name}</p>
                          </div>
                          <div>
                            <Label className="text-sm font-medium">Your Details</Label>
                            <p className="text-foreground mt-2 text-sm">{session.name}</p>
                            {session.organization && (
                              <p className="text-muted-foreground text-sm">{session.organization}</p>
                            )}
                          </div>
                          <div>
                            <Label htmlFor="description" className="text-sm font-medium">
                              Why do you need this device?
                            </Label>
                            <Textarea
                              id="description"
                              placeholder="Tell us about your intended use..."
                              value={requestDescription}
                              onChange={(e) => setRequestDescription(e.target.value)}
                              disabled={submitting}
                              className="mt-2 min-h-24 bg-input border-border focus:ring-1"
                            />
                          </div>
                          <div>
                            <Label htmlFor="urgency" className="text-sm font-medium">
                              Urgency Level
                            </Label>
                            <Select value={urgency} onValueChange={setUrgency} disabled={submitting}>
                              <SelectTrigger id="urgency" className="mt-2 bg-input border-border focus:ring-1">
                                <SelectValue placeholder="Select urgency" />
                              </SelectTrigger>
                              <SelectContent className="bg-card border-border">
                                <SelectItem value="low">Low - When available</SelectItem>
                                <SelectItem value="medium">Medium - Needed soon</SelectItem>
                                <SelectItem value="high">High - Urgent need</SelectItem>
                                <SelectItem value="critical">Critical - Time sensitive</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="reason" className="text-sm font-medium">
                              Reason for Urgency
                            </Label>
                            <Textarea
                              id="reason"
                              placeholder="Explain why this is urgent (health, education, employment, etc.)..."
                              value={reason}
                              onChange={(e) => setReason(e.target.value)}
                              disabled={submitting}
                              className="mt-2 min-h-24 bg-input border-border focus:ring-1"
                            />
                          </div>
                          {!session.verified && (
                            <div className="flex gap-2 bg-amber-500/5 border border-amber-500/20 rounded p-3">
                              <AlertCircle className="w-4 h-4 text-amber-600 flex-shrink-0 mt-0.5" />
                              <p className="text-xs text-amber-600">
                                This request will be marked as pending until verified
                              </p>
                            </div>
                          )}
                          <Button
                            onClick={submitRequest}
                            disabled={submitting || !requestDescription.trim()}
                            className="w-full bg-primary hover:bg-primary/90"
                          >
                            {submitting ? "Submitting..." : "Submit Request"}
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <ReportDialog deviceId={device.id} deviceName={device.name} />
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  )
}
