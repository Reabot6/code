"use client"

import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { storage } from "@/lib/storage"
import { LogOut, Shield, ShieldAlert } from "lucide-react"
import Link from "next/link"

interface NavigationProps {
  title?: string
}

export function Navigation({ title }: NavigationProps) {
  const router = useRouter()
  const pathname = usePathname()
  const session = storage.getSession()

  const handleLogout = () => {
    storage.clearSession()
    router.push("/")
  }

  const handleHome = () => {
    if (session?.type === "contributor") {
      router.push("/dashboard/contributor")
    } else {
      router.push("/dashboard")
    }
  }

  return (
    <header className="border-b border-border sticky top-0 bg-background/80 backdrop-blur-xl z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
        {/* Logo */}
        <button onClick={handleHome} className="flex items-center gap-3 hover:opacity-70 transition">
          <div className="w-9 h-9 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center text-primary-foreground font-bold text-sm">
            TB
          </div>
          <span className="font-bold text-base text-foreground hidden sm:inline">{title || "TechBridge"}</span>
        </button>

        {/* Center Navigation - shown when logged in */}
        {session && (
          <nav className="hidden md:flex items-center gap-1">
            {session.type === "contributor" ? (
              <>
                <Link href="/dashboard/contributor">
                  <Button
                    variant={pathname === "/dashboard/contributor" ? "default" : "ghost"}
                    size="sm"
                    className="text-xs"
                  >
                    Dashboard
                  </Button>
                </Link>
                <Link href="/dashboard/contributor/add-device">
                  <Button
                    variant={pathname === "/dashboard/contributor/add-device" ? "default" : "ghost"}
                    size="sm"
                    className="text-xs"
                  >
                    Add Device
                  </Button>
                </Link>
                <Link href="/dashboard/contributor/my-devices">
                  <Button
                    variant={pathname === "/dashboard/contributor/my-devices" ? "default" : "ghost"}
                    size="sm"
                    className="text-xs"
                  >
                    My Devices
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link href="/dashboard">
                  <Button variant={pathname === "/dashboard" ? "default" : "ghost"} size="sm" className="text-xs">
                    Dashboard
                  </Button>
                </Link>
                <Link href="/dashboard/browse-devices">
                  <Button
                    variant={pathname === "/dashboard/browse-devices" ? "default" : "ghost"}
                    size="sm"
                    className="text-xs"
                  >
                    Browse Devices
                  </Button>
                </Link>
                <Link href="/dashboard/my-requests">
                  <Button
                    variant={pathname === "/dashboard/my-requests" ? "default" : "ghost"}
                    size="sm"
                    className="text-xs"
                  >
                    My Requests
                  </Button>
                </Link>
              </>
            )}
          </nav>
        )}

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {session && (
            <>
              <div className="text-right hidden sm:block pr-4 border-r border-border">
                <p className="text-sm font-medium text-foreground">{session.name}</p>
                <button
                  onClick={() => router.push("/account/verify")}
                  className="flex items-center gap-1 text-xs hover:opacity-70 transition"
                >
                  {session.verified ? (
                    <div className="flex items-center gap-1 text-green-600">
                      <Shield className="w-3 h-3" />
                      Verified
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-amber-600">
                      <ShieldAlert className="w-3 h-3" />
                      Verify
                    </div>
                  )}
                </button>
              </div>
              {/* Verification button for mobile */}
              <button
                onClick={() => router.push("/account/verify")}
                className="md:hidden p-2 hover:bg-card rounded-lg transition"
              >
                {session.verified ? (
                  <Shield className="w-4 h-4 text-green-600" />
                ) : (
                  <ShieldAlert className="w-4 h-4 text-amber-600" />
                )}
              </button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="gap-2 text-muted-foreground hover:text-foreground"
              >
                <LogOut className="w-4 h-4" />
                <span className="hidden sm:inline">Logout</span>
              </Button>
            </>
          )}
        </div>
      </div>
    </header>
  )
}
