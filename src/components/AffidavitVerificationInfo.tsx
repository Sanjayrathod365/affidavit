"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { AffidavitQRCode } from "./AffidavitQRCode"
import { CopyIcon, CheckIcon } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface AffidavitVerificationInfoProps {
  affidavitId: string
  verificationCode: string
  status: string
}

export function AffidavitVerificationInfo({ 
  affidavitId, 
  verificationCode, 
  status 
}: AffidavitVerificationInfoProps) {
  const [copied, setCopied] = useState(false)
  const [verificationUrl, setVerificationUrl] = useState("")

  useEffect(() => {
    // Create the verification URL with pre-filled document ID
    const baseUrl = window.location.origin
    const url = new URL(`${baseUrl}/verification`)
    url.searchParams.append("documentId", affidavitId)
    url.searchParams.append("code", verificationCode)
    setVerificationUrl(url.toString())
  }, [affidavitId, verificationCode])

  const copyToClipboard = () => {
    navigator.clipboard.writeText(verificationUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (!verificationCode) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Document Verification</CardTitle>
          <CardDescription>
            This affidavit doesn't have a verification code yet. It will be generated when the document is approved.
          </CardDescription>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <CardTitle>Document Verification</CardTitle>
          <Badge variant={status === "APPROVED" ? "default" : "secondary"} className={status === "APPROVED" ? "bg-green-500" : ""}>
            {status}
          </Badge>
        </div>
        <CardDescription>
          Use this information to verify the authenticity of this affidavit
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-center">
          <AffidavitQRCode 
            affidavitId={affidavitId}
            verificationCode={verificationCode}
          />
        </div>

        <div className="space-y-2 mt-4">
          <div className="text-sm font-medium">Verification Code</div>
          <div className="flex items-center gap-2">
            <code className="relative rounded bg-muted px-[0.3rem] py-[0.2rem] font-mono text-sm">
              {verificationCode}
            </code>
          </div>
        </div>

        <div className="space-y-2">
          <div className="text-sm font-medium">Verification URL</div>
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={verificationUrl}
              readOnly
              className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
            />
            <Button 
              variant="outline" 
              size="icon" 
              onClick={copyToClipboard}
              title={copied ? "Copied!" : "Copy to clipboard"}
            >
              {copied ? <CheckIcon className="h-4 w-4" /> : <CopyIcon className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        <div className="mt-4 space-y-2 text-sm text-muted-foreground">
          <p>
            <strong>Instructions:</strong> Share this verification code or QR code with anyone who needs to verify this document.
          </p>
          <ol className="list-decimal list-inside space-y-1">
            <li>Visit the verification page by scanning the QR code or using the link above</li>
            <li>Enter the verification code if not pre-filled</li>
            <li>Verify that the document details match the physical document</li>
          </ol>
        </div>
      </CardContent>
    </Card>
  )
} 