"use client"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { storage } from "@/lib/storage"
import { Flag, AlertCircle } from "lucide-react"

interface ReportDialogProps {
  deviceId: string
  deviceName: string
}

export function ReportDialog({ deviceId, deviceName }: ReportDialogProps) {
  const [open, setOpen] = useState(false)
  const [reportType, setReportType] = useState("")
  const [description, setDescription] = useState("")
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async () => {
    if (!reportType) return

    setLoading(true)
    try {
      const session = storage.getSession()
      if (!session) throw new Error("Not logged in")

      // Create mock user ID for demo
      const reporterId = session.id || "user_" + Math.random().toString(36).substring(7)

      await storage.createReport({
        device_id: deviceId,
        reporter_id: reporterId,
        reason: reportType,
        description,
        report_type: reportType as any,
        status: "open",
      })

      setSubmitted(true)
      setTimeout(() => {
        setOpen(false)
        setReportType("")
        setDescription("")
        setSubmitted(false)
      }, 2000)
    } catch (error) {
      console.error("Error submitting report:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="gap-2 text-red-600 hover:text-red-700 hover:bg-red-50">
          <Flag className="w-4 h-4" />
          Report
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md border-border bg-card">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-600" />
            Report Device
          </DialogTitle>
          <DialogDescription>Report "{deviceName}" for review</DialogDescription>
        </DialogHeader>

        {submitted ? (
          <div className="flex flex-col items-center justify-center py-8 gap-3">
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
              <Flag className="w-6 h-6 text-green-600" />
            </div>
            <p className="text-sm font-medium">Report submitted successfully</p>
            <p className="text-xs text-muted-foreground text-center">Our team will review this report</p>
          </div>
        ) : (
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="report-type" className="text-sm font-medium">
                Report Type
              </Label>
              <Select value={reportType} onValueChange={setReportType}>
                <SelectTrigger id="report-type" className="bg-input border-border">
                  <SelectValue placeholder="Select a reason..." />
                </SelectTrigger>
                <SelectContent className="bg-card border-border">
                  <SelectItem value="inappropriate">Inappropriate Content</SelectItem>
                  <SelectItem value="damaged">Device Damaged</SelectItem>
                  <SelectItem value="fraud">Fraudulent Device</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="report-description" className="text-sm font-medium">
                Additional Details
              </Label>
              <Textarea
                id="report-description"
                placeholder="Describe the issue..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="bg-input border-border min-h-24"
              />
            </div>

            <Button
              onClick={handleSubmit}
              disabled={loading || !reportType}
              className="w-full bg-red-600 hover:bg-red-700 text-white"
            >
              {loading ? "Submitting..." : "Submit Report"}
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
