"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Navigation } from "@/components/navigation"
import { Footer } from "@/components/footer"
import { Card, CardContent } from "@/components/ui/card"
import { storage, type DeviceRequest } from "@/lib/storage"
import { MessageSquare, AlertCircle, Loader } from "lucide-react"
import Link from "next/link"

export default function MyRequests() {
  const router = useRouter()
  const [session, setSession] = useState<any>(null)
  const [requests, setRequests] = useState<DeviceRequest[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const userSession = storage.getSession()
    if (!userSession || userSession.type === "contributor") {
      router.push("/")
      return
    }
    setSession(userSession)
  }, [router])

  useEffect(() => {
    if (!session?.id) return

    const loadRequests = async () => {
      try {
        console.log("[v0] Loading requests for user:", session.id)
        setLoading(true)
        const userRequests = await storage.getRequestsByUser(session.id)
        console.log("[v0] Requests loaded:", userRequests)
        setRequests(
          (userRequests || []).sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()),
        )
      } catch (error) {
        console.error("[v0] Error loading requests:", error)
        setRequests([])
      } finally {
        setLoading(false)
      }
    }

    loadRequests()
  }, [session?.id])

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navigation />

      <main className="flex-1">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header */}
          <div className="mb-12">
            <Link href="/dashboard" className="text-sm text-muted-foreground hover:text-foreground mb-4 inline-block">
              ← Back to Dashboard
            </Link>
            <h1 className="text-4xl font-bold text-foreground mb-2">My Requests</h1>
            <p className="text-muted-foreground">
              {loading ? "Loading..." : `${requests.length} request${requests.length !== 1 ? "s" : ""}`}
            </p>
          </div>

          {loading ? (
            <Card className="border-border">
              <CardContent className="pt-12 pb-8 text-center flex items-center justify-center gap-3">
                <Loader className="w-5 h-5 animate-spin text-muted-foreground" />
                <p className="text-muted-foreground">Loading requests...</p>
              </CardContent>
            </Card>
          ) : requests.length === 0 ? (
            <Card className="border-border">
              <CardContent className="pt-12 pb-8 text-center">
                <MessageSquare className="w-12 h-12 text-muted-foreground/30 mx-auto mb-4" />
                <p className="text-muted-foreground">You haven't submitted any requests yet.</p>
                <p className="text-sm text-muted-foreground mt-2">
                  <Link href="/dashboard/browse-devices" className="text-primary hover:underline">
                    Browse available devices
                  </Link>{" "}
                  to get started.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {requests.map((request) => (
                <Card key={request.id} className="border-border">
                  <CardContent className="pt-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground text-lg">Device Request</h3>
                        <p className="text-xs text-muted-foreground mt-1">Request ID: {request.id.substring(0, 8)}</p>
                        {request.request_description && (
                          <div className="mt-4 p-4 bg-card/50 border border-border rounded">
                            <p className="text-xs font-medium text-muted-foreground mb-2">Request Reason:</p>
                            <p className="text-sm text-foreground">{request.request_description}</p>
                          </div>
                        )}
                        <p className="text-xs text-muted-foreground mt-4">
                          Requested: {request.created_at?.split("T")[0]}
                        </p>
                      </div>
                      <div className="text-right ml-4 flex-shrink-0">
                        <div className="flex items-center gap-2">
                          {!request.user_verified && <AlertCircle className="w-4 h-4 text-amber-600" />}
                          <span
                            className={`text-xs px-3 py-1.5 rounded-full font-medium whitespace-nowrap ${
                              request.status === "approved"
                                ? "bg-green-500/10 text-green-600 border border-green-500/20"
                                : request.status === "rejected"
                                  ? "bg-red-500/10 text-red-600 border border-red-500/20"
                                  : "bg-blue-500/10 text-blue-600 border border-blue-500/20"
                            }`}
                          >
                            {!request.user_verified ? "Pending Verification" : request.status}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
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
