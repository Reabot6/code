"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { storage, type Device } from "@/lib/storage"
import { CheckCircle, AlertCircle, Plus, Loader } from "lucide-react"
import Link from "next/link"

export default function MyDevices() {
  const router = useRouter()
  const [session, setSession] = useState<any>(null)
  const [devices, setDevices] = useState<Device[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const userSession = storage.getSession()
    if (!userSession || userSession.type !== "contributor") {
      router.push("/")
      return
    }
    setSession(userSession)
    loadDevices()
  }, [router])

  const loadDevices = async () => {
    try {
      setLoading(true)
      const allDevices = await storage.getDevicesByContributor(session?.id)
      setDevices(allDevices || [])
    } catch (error) {
      console.error("Error loading devices:", error)
    } finally {
      setLoading(false)
    }
  }

  const approveRequest = async (deviceId: string, requestId: string) => {
    try {
      await storage.updateRequest(requestId, "approved")
      await loadDevices()
    } catch (error) {
      console.error("Error approving request:", error)
    }
  }

  const rejectRequest = async (deviceId: string, requestId: string) => {
    try {
      await storage.updateRequest(requestId, "rejected")
      await loadDevices()
    } catch (error) {
      console.error("Error rejecting request:", error)
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
            <Link
              href="/dashboard/contributor"
              className="text-sm text-muted-foreground hover:text-foreground mb-4 inline-block"
            >
              ← Back to Dashboard
            </Link>
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold text-foreground mb-2">My Devices</h1>
                <p className="text-muted-foreground">Manage your device contributions</p>
              </div>
              <Link href="/dashboard/contributor/add-device">
                <Button className="gap-2 bg-primary hover:bg-primary/90">
                  <Plus className="w-4 h-4" />
                  Add Device
                </Button>
              </Link>
            </div>
          </div>

          {loading ? (
            <Card className="border-border">
              <CardContent className="pt-12 pb-8 text-center flex items-center justify-center gap-3">
                <Loader className="w-5 h-5 animate-spin text-muted-foreground" />
                <p className="text-muted-foreground">Loading devices...</p>
              </CardContent>
            </Card>
          ) : devices.length === 0 ? (
            <Card className="border-border">
              <CardContent className="pt-12 pb-8 text-center">
                <Plus className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-muted-foreground mb-2">You haven't added any devices yet.</p>
                <p className="text-sm text-muted-foreground mb-6">
                  Start contributing by adding your first device to the network.
                </p>
                <Link href="/dashboard/contributor/add-device">
                  <Button className="bg-primary hover:bg-primary/90">Add Your First Device</Button>
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-6">
              {devices.map((device) => (
                <Card key={device.id} className="border-border overflow-hidden">
                  <div className="md:flex">
                    {device.image_url && (
                      <div className="md:w-48 h-48 flex-shrink-0 bg-card border-r border-border">
                        <img
                          src={device.image_url || "/placeholder.svg"}
                          alt={device.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <CardTitle className="text-xl">{device.name}</CardTitle>
                            <CardDescription className="mt-1">{device.type}</CardDescription>
                          </div>
                          <span
                            className={`text-xs px-3 py-1.5 rounded-full font-medium ml-4 ${
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
                      <CardContent className="space-y-6">
                        <p className="text-muted-foreground text-sm">{device.description}</p>

                        {!device.requests || device.requests.length === 0 ? (
                          <div className="flex gap-2 p-4 bg-muted/30 rounded-lg">
                            <AlertCircle className="w-4 h-4 text-muted-foreground flex-shrink-0 mt-0.5" />
                            <p className="text-sm text-muted-foreground">No requests yet for this device</p>
                          </div>
                        ) : (
                          <div>
                            <h4 className="text-sm font-semibold text-foreground mb-4">
                              Requests ({device.requests.length})
                            </h4>
                            <div className="space-y-3 max-h-96 overflow-y-auto">
                              {device.requests.map((request) => (
                                <div
                                  key={request.id}
                                  className="p-4 bg-card/50 border border-border rounded-lg space-y-3"
                                >
                                  <div className="flex items-start justify-between">
                                    <div className="flex-1">
                                      <p className="text-sm font-semibold text-foreground">{request.user_name}</p>
                                      <p className="text-xs text-muted-foreground mt-0.5">
                                        {request.user_type === "organization"
                                          ? `Organization • ${request.user_organization}`
                                          : "Individual User"}{" "}
                                        • {request.created_at?.split("T")[0]}
                                      </p>
                                    </div>
                                    <div className="flex items-center gap-2 ml-2 flex-shrink-0">
                                      {!request.user_verified && (
                                        <AlertCircle className="w-4 h-4 text-amber-600" title="User not verified" />
                                      )}
                                      <span
                                        className={`text-xs px-2 py-1 rounded-full font-medium ${
                                          request.status === "approved"
                                            ? "bg-green-500/10 text-green-600 border border-green-500/20"
                                            : request.status === "rejected"
                                              ? "bg-red-500/10 text-red-600 border border-red-500/20"
                                              : "bg-blue-500/10 text-blue-600 border border-blue-500/20"
                                        }`}
                                      >
                                        {request.status}
                                      </span>
                                    </div>
                                  </div>

                                  {request.request_description && (
                                    <div className="bg-background/40 rounded p-3 border border-border/50">
                                      <p className="text-xs text-muted-foreground font-medium mb-2">Request Reason:</p>
                                      <p className="text-sm text-foreground">{request.request_description}</p>
                                    </div>
                                  )}

                                  {request.status === "pending" && (
                                    <div className="flex gap-2 pt-2">
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => approveRequest(device.id, request.id)}
                                        className="flex-1 text-xs border-border hover:bg-green-500/10 hover:text-green-600"
                                      >
                                        <CheckCircle className="w-3 h-3 mr-1" />
                                        Approve
                                      </Button>
                                      <Button
                                        size="sm"
                                        variant="outline"
                                        onClick={() => rejectRequest(device.id, request.id)}
                                        className="flex-1 text-xs border-border hover:bg-red-500/10 hover:text-red-600"
                                      >
                                        Reject
                                      </Button>
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </div>
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
