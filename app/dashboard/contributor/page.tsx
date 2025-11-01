"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { storage, type Device, type DeviceRequest } from "@/lib/storage"
import { Plus, TrendingUp, Clock, CheckCircle, AlertCircle, Bell } from "lucide-react"
import Link from "next/link"

export default function ContributorDashboard() {
  const router = useRouter()
  const [session, setSession] = useState<any>(null)
  const [devices, setDevices] = useState<Device[]>([])
  const [allRequests, setAllRequests] = useState<DeviceRequest[]>([])
  const [stats, setStats] = useState({ total: 0, totalRequests: 0, approved: 0, pending: 0 })
  const [newNotifications, setNewNotifications] = useState(0)

  useEffect(() => {
    const userSession = storage.getSession()
    if (!userSession || userSession.type !== "contributor") {
      router.push("/")
      return
    }
    setSession(userSession)
    loadData()
  }, [router])

  const loadData = async () => {
    try {
      // Get contributor's devices
      const contributorDevices = await storage.getDevicesByContributor(session?.id || "")
      setDevices(contributorDevices || [])

      // Get all requests for contributor's devices
      let allReqs: DeviceRequest[] = []
      if (contributorDevices && contributorDevices.length > 0) {
        for (const device of contributorDevices) {
          const reqs = await storage.getRequestsByDevice(device.id)
          allReqs = [...allReqs, ...(reqs || [])]
        }
      }
      setAllRequests(allReqs)

      // Calculate stats
      const totalRequests = allReqs.length
      const approvedRequests = allReqs.filter((r) => r.status === "approved").length
      const pendingRequests = allReqs.filter((r) => r.status === "pending").length
      const newNotifs = allReqs.filter((r) => r.status === "pending" && !r.user_verified).length

      setStats({
        total: contributorDevices?.length || 0,
        totalRequests,
        approved: approvedRequests,
        pending: pendingRequests,
      })
      setNewNotifications(newNotifs)
    } catch (error) {
      console.error("Error loading contributor data:", error)
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
          {/* Welcome Section */}
          <div className="mb-12">
            <h1 className="text-4xl font-bold text-foreground mb-2">Welcome back, {session.name.split(" ")[0]}</h1>
            <p className="text-muted-foreground">
              {session.organization ? `${session.organization} - Partner Dashboard` : "Individual Sponsor Dashboard"}
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
                      Your contributions are marked as pending. Verify your account to enable immediate processing.
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

          {/* New Notifications Alert */}
          {newNotifications > 0 && (
            <Card className="mb-8 border-blue-500/20 bg-blue-500/5">
              <CardContent className="pt-6 flex items-start gap-4">
                <Bell className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-medium text-blue-600">New Requests</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    You have {newNotifications} new device request{newNotifications !== 1 ? "s" : ""} awaiting review.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Stats Grid */}
          <div className="grid md:grid-cols-4 gap-6 mb-12">
            <Card className="border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  Devices
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{stats.total}</p>
                <p className="text-xs text-muted-foreground mt-2">Active contributions</p>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Requests
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{stats.totalRequests}</p>
                <p className="text-xs text-muted-foreground mt-2">Total received</p>
              </CardContent>
            </Card>

            <Card className="border-border">
              <CardHeader className="pb-3">
                <CardTitle className="text-xs font-medium text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  Pending
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold text-amber-600">{stats.pending}</p>
                <p className="text-xs text-muted-foreground mt-2">Awaiting review</p>
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
          </div>

          {/* Action Cards */}
          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <Card className="border-border hover:border-primary/50 transition">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>Add Device</CardTitle>
                    <CardDescription>Contribute a device to the network</CardDescription>
                  </div>
                  <Plus className="w-5 h-5 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <Link href="/dashboard/contributor/add-device" className="block">
                  <Button className="w-full bg-primary hover:bg-primary/90">Add New Device</Button>
                </Link>
              </CardContent>
            </Card>

            <Card className="border-border hover:border-primary/50 transition">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle>My Devices</CardTitle>
                    <CardDescription>Manage your contributions and requests</CardDescription>
                  </div>
                  <TrendingUp className="w-5 h-5 text-muted-foreground" />
                </div>
              </CardHeader>
              <CardContent>
                <Link href="/dashboard/contributor/my-devices" className="block">
                  <Button variant="outline" className="w-full border-border bg-transparent">
                    View My Devices
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Recent Requests */}
          <Card className="border-border">
            <CardHeader>
              <CardTitle>Recent Requests</CardTitle>
              <CardDescription>
                {allRequests.length === 0
                  ? "No requests yet"
                  : `${allRequests.length} total request${allRequests.length !== 1 ? "s" : ""}`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {allRequests.length === 0 ? (
                <p className="text-muted-foreground text-sm">
                  Add devices and they'll appear here once people request them.
                </p>
              ) : (
                <div className="space-y-3 max-h-80 overflow-y-auto">
                  {allRequests.slice(0, 10).map((request) => (
                    <div
                      key={request.id}
                      className="flex items-start justify-between p-3 bg-card border border-border rounded-lg"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-sm">{request.user_name}</p>
                        <p className="text-xs text-muted-foreground">{request.user_type}</p>
                        <p className="text-xs text-muted-foreground mt-1">Urgency: {request.status}</p>
                      </div>
                      <span
                        className={`text-xs px-2.5 py-1 rounded-full font-medium whitespace-nowrap ${
                          request.status === "approved"
                            ? "bg-green-500/10 text-green-600 border border-green-500/20"
                            : request.status === "pending"
                              ? "bg-amber-500/10 text-amber-600 border border-amber-500/20"
                              : "bg-red-500/10 text-red-600 border border-red-500/20"
                        }`}
                      >
                        {request.status}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}
