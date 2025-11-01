"use client"

import { useEffect, useRef, useState } from "react"
import { Card } from "@/components/ui/card"
import { AlertCircle, Loader } from "lucide-react"
import type { Device } from "@/lib/storage"

interface MapProps {
  devices: Device[]
  userLocation?: { latitude: number; longitude: number }
  onDeviceSelect?: (device: Device) => void
  height?: string
}

export function MapComponent({ devices, userLocation, onDeviceSelect, height = "h-96" }: MapProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!mapContainer.current) return

    // Simple map visualization using canvas
    const canvas = document.createElement("canvas")
    canvas.width = mapContainer.current.clientWidth
    canvas.height = mapContainer.current.clientHeight
    const ctx = canvas.getContext("2d")

    if (!ctx) return

    // Draw background
    ctx.fillStyle = "#f3f4f6"
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    // Draw grid
    ctx.strokeStyle = "#e5e7eb"
    ctx.lineWidth = 1
    for (let i = 0; i < canvas.width; i += 50) {
      ctx.beginPath()
      ctx.moveTo(i, 0)
      ctx.lineTo(i, canvas.height)
      ctx.stroke()
    }
    for (let i = 0; i < canvas.height; i += 50) {
      ctx.beginPath()
      ctx.moveTo(0, i)
      ctx.lineTo(canvas.width, i)
      ctx.stroke()
    }

    // Normalize coordinates to canvas
    const allLocs = [...(userLocation ? [userLocation] : []), ...devices.filter((d) => d.latitude && d.longitude)]

    if (allLocs.length > 0) {
      const minLat = Math.min(...allLocs.map((l) => l.latitude))
      const maxLat = Math.max(...allLocs.map((l) => l.latitude))
      const minLon = Math.min(...allLocs.map((l) => l.longitude))
      const maxLon = Math.max(...allLocs.map((l) => l.longitude))

      const latRange = maxLat - minLat || 1
      const lonRange = maxLon - minLon || 1

      // Draw user location
      if (userLocation) {
        const x = ((userLocation.longitude - minLon) / lonRange) * (canvas.width - 40) + 20
        const y = ((maxLat - userLocation.latitude) / latRange) * (canvas.height - 40) + 20

        ctx.fillStyle = "#3b82f6"
        ctx.beginPath()
        ctx.arc(x, y, 8, 0, Math.PI * 2)
        ctx.fill()
        ctx.fillStyle = "#fff"
        ctx.font = "bold 10px sans-serif"
        ctx.textAlign = "center"
        ctx.fillText("You", x, y + 20)
      }

      // Draw devices
      devices.forEach((device, idx) => {
        if (!device.latitude || !device.longitude) return

        const x = ((device.longitude - minLon) / lonRange) * (canvas.width - 40) + 20
        const y = ((maxLat - device.latitude) / latRange) * (canvas.height - 40) + 20

        // Device marker
        ctx.fillStyle = "#10b981"
        ctx.beginPath()
        ctx.arc(x, y, 6, 0, Math.PI * 2)
        ctx.fill()

        // Label
        ctx.fillStyle = "#000"
        ctx.font = "10px sans-serif"
        ctx.textAlign = "center"
        ctx.fillText(device.name.substring(0, 8), x, y + 18)
      })
    }

    mapContainer.current.innerHTML = ""
    mapContainer.current.appendChild(canvas)
    setLoading(false)
  }, [devices, userLocation])

  if (error) {
    return (
      <Card className="p-4 bg-red-50 border-red-200">
        <div className="flex gap-2">
          <AlertCircle className="w-5 h-5 text-red-500" />
          <p className="text-sm text-red-600">{error}</p>
        </div>
      </Card>
    )
  }

  return (
    <Card className={`overflow-hidden ${height}`}>
      {loading && (
        <div className="w-full h-full flex items-center justify-center bg-gray-50">
          <Loader className="w-6 h-6 animate-spin text-muted-foreground" />
        </div>
      )}
      <div ref={mapContainer} className="w-full h-full" />
    </Card>
  )
}
