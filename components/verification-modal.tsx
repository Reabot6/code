// New verification modal component

"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { storage } from "@/lib/storage"
import { AlertCircle, CheckCircle2, Upload } from "lucide-react"

interface VerificationModalProps {
  open: boolean
  onComplete: () => void
}

export function VerificationModal({ open, onComplete }: VerificationModalProps) {
  const [step, setStep] = useState<"info" | "upload">("info")
  const [fileName, setFileName] = useState("")
  const [imageData, setImageData] = useState<string>("")

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
    if (imageData) {
      const session = storage.getSession()
      if (session) {
        storage.updateSession({
          verified: true,
          verificationImage: imageData,
        })
      }
    }
    onComplete()
  }

  const handleSkip = () => {
    onComplete()
  }

  return (
    <Dialog open={open}>
      <DialogContent className="max-w-md border-border bg-card">
        {step === "info" ? (
          <>
            <DialogHeader>
              <div className="flex items-center justify-center w-12 h-12 rounded-full bg-blue-500/10 mx-auto mb-4">
                <AlertCircle className="w-6 h-6 text-blue-500" />
              </div>
              <DialogTitle className="text-center text-xl">Verify Your Account</DialogTitle>
              <DialogDescription className="text-center mt-2">
                Submit legal identification to unlock full access. Your requests and contributions will be pending until
                verified.
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-6">
              <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-4 space-y-2">
                <p className="text-sm font-medium text-foreground">Accepted Documents:</p>
                <ul className="text-xs text-muted-foreground space-y-1">
                  <li>• Government-issued ID</li>
                  <li>• Passport</li>
                  <li>• Driver's License</li>
                  <li>• Any valid legal identification</li>
                </ul>
              </div>

              <div className="bg-amber-500/5 border border-amber-500/20 rounded-lg p-4">
                <p className="text-xs text-muted-foreground">
                  You can use the app without verification, but all requests and contributions will be marked as pending
                  until your identity is confirmed.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={handleSkip} className="flex-1 border-border bg-transparent">
                Skip for Now
              </Button>
              <Button onClick={() => setStep("upload")} className="flex-1 bg-primary hover:bg-primary/90">
                Verify Now
              </Button>
            </div>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-center text-xl">Upload Identification</DialogTitle>
              <DialogDescription className="text-center mt-2">
                Upload a clear image of your legal identification
              </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 py-6">
              <div className="relative">
                <Input
                  type="file"
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="verification-upload"
                />
                <label
                  htmlFor="verification-upload"
                  className="flex flex-col items-center justify-center gap-3 w-full p-8 border-2 border-dashed border-border rounded-lg cursor-pointer hover:border-primary/50 hover:bg-primary/5 transition"
                >
                  <Upload className="w-6 h-6 text-muted-foreground" />
                  <div className="text-center">
                    {fileName ? (
                      <>
                        <p className="text-sm font-medium text-foreground">{fileName}</p>
                        <p className="text-xs text-green-600">Uploaded successfully</p>
                      </>
                    ) : (
                      <>
                        <p className="text-sm font-medium text-foreground">Click to upload</p>
                        <p className="text-xs text-muted-foreground">or drag and drop</p>
                      </>
                    )}
                  </div>
                </label>
              </div>

              {imageData && (
                <div className="flex items-center gap-2 bg-green-500/10 border border-green-500/20 rounded-lg p-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <p className="text-sm text-green-600">Document uploaded and verified</p>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setStep("info")} className="flex-1 border-border">
                Back
              </Button>
              <Button onClick={handleVerify} disabled={!imageData} className="flex-1 bg-primary hover:bg-primary/90">
                Verify Account
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
