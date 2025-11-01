"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { storage, type Device, type DeviceRequest } from "@/lib/storage"
import { Plus, TrendingUp, Clock, CheckCircle, AlertCircle } from "lucide-react"
import Link from "next/link"

export default function UserDashboard() {
  const router = useRouter()
  const [session, setSession] = useState<any>(null)
  const [devices, setDevices] = useState<Device[]>([])
  const [stats, setStats] = useState({ total: 0, approved: 0, pending: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const userSession = storage.getSession()
    if (!userSession || userSession.type === "contributor") {
      router.push("/")
      return
    }
    setSession(userSession)

    const loadData = async () => {
      try {
        const allDevices = await storage.getDevices()
        setDevices(Array.isArray(allDevices) ? allDevices : [])

        // Get user requests from Supabase with proper UUID validation
        if (userSession.id && typeof userSession.id === "string" && userSession.id.length > 8) {
          const userRequests = await storage.getRequestsByUser(userSession.id)
          const requestsArray = Array.isArray(userRequests) ? userRequests : []

          setStats({
            total: requestsArray.length,
            approved: requestsArray.filter((r: DeviceRequest) => r.status === "approved").length,
            pending: requestsArray.filter((r: DeviceRequest) => r.status === "pending").length,
          })
        }
      } catch (error) {
        console.error("[v0] Error loading dashboard data:", error)
        setDevices([])
        setStats({ total: 0, approved: 0, pending: 0 })
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [router])

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />

      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Welcome Section */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-2">Welcome, {session.name.split(" ")[0]}</h1>
            <p className="text-muted-foreground">
              {session.organization ? `Organization • ${session.organization}` : "Individual User"}
            </p>
          </div>

          {/* Verification Alert */}
          {!session.verified && (
            <Card className="mb-8 border-amber-500/20 bg-amber-500/5">
              <CardContent className="pt-6 flex items-start justify-between">
                <div className="flex gap-4 flex-1">
                  <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-amber-600">Account Verification Pending</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Your requests are marked as pending. Verify your account to process requests immediately.
                    </p>
                  </div>
                </div>
                <Link href="/account/verify">
                  <Button size="sm" className="bg-amber-600 hover:bg-amber-700 ml-4 flex-shrink-0">
                    Verify Now
                  </Button>
                </Link>
              </CardContent>
            </Card>
          )}

          {/* Stats Grid */}
          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Total Requests
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{stats.total}</p>
                <p className="text-xs text-muted-foreground mt-2">Lifetime requests</p>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                  <CheckCircle className="w-4 h-4" />
                  Approved
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-green-600">{stats.approved}</p>
                <p className="text-xs text-muted-foreground mt-2">Successful matches</p>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Pending
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-blue-600">{stats.pending}</p>
                <p className="text-xs text-muted-foreground mt-2">Awaiting review</p>
              </CardContent>
            </Card>
          </div>

          {/* Action Cards */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <Card className="border-border hover:border-primary/50 transition cursor-pointer">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>Browse Devices</CardTitle>
                    <CardDescription>Explore available devices from contributors</CardDescription>
                  </div>
                  <Plus className="w-5 h-5 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <Link href="/dashboard/browse-devices" className="block">
                  <Button variant="outline" className="w-full border-border bg-transparent">
                    Browse Devices
                  </Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-border hover:border-primary/50 transition cursor-pointer">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>My Requests</CardTitle>
                    <CardDescription>Track your device requests</CardDescription>
                  </div>
                  <Clock className="w-5 h-5 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <Link href="/dashboard/my-requests" className="block">
                  <Button variant="outline" className="w-full border-border bg-transparent">
                    View Requests
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Recent Devices Section */}
          <section>
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-foreground mb-2">Available Devices</h2>
              <p className="text-sm text-muted-foreground">{devices.length} devices available</p>
            </div>

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
                  <p className="text-sm text-muted-foreground">Contributors will add devices soon. Check back later!</p>
                </CardContent>
              </Card>
            ) : (
              <div className="grid md:grid-cols-3 gap-6">
                {devices.slice(0, 3).map((device) => (
                  <Card key={device.id} className="border-border overflow-hidden">
                    {device.image_url && (
                      <div className="w-full h-40 bg-card border-b border-border overflow-hidden">
                        <img
                          src={device.image_url || "/placeholder.svg"}
                          alt={device.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    )}
                    <CardHeader>
                      <CardTitle className="text-base">{device.name}</CardTitle>
                      <CardDescription>{device.type}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">{device.description.substring(0, 80)}...</p>
                      <Link href="/dashboard/browse-devices">
                        <Button className="w-full bg-primary hover:bg-primary/90 text-xs">View & Request</Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {devices.length > 3 && (
              <div className="text-center mt-8">
                <Link href="/dashboard/browse-devices">
                  <Button variant="outline" className="border-border bg-transparent">
                    View All Devices
                  </Button>
                </Link>
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  )
}
