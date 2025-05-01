"use client"

import { useState, useEffect } from "react"
import { QRCodeSVG } from "qrcode.react"
import { Card, CardContent } from "@/components/ui/card"

interface AffidavitQRCodeProps {
  affidavitId: string
  verificationCode: string
  size?: number
}

export function AffidavitQRCode({ affidavitId, verificationCode, size = 128 }: AffidavitQRCodeProps) {
  const [verificationUrl, setVerificationUrl] = useState<string>("")

  useEffect(() => {
    // Create the verification URL with pre-filled document ID
    const baseUrl = window.location.origin
    const url = new URL(`${baseUrl}/verification`)
    url.searchParams.append("documentId", affidavitId)
    setVerificationUrl(url.toString())
  }, [affidavitId])

  if (!verificationUrl) {
    return null
  }

  return (
    <Card className="w-fit mx-auto">
      <CardContent className="p-4 text-center">
        <QRCodeSVG 
          value={verificationUrl}
          size={size}
          className="mb-2"
        />
        <div className="mt-2 text-xs text-muted-foreground">
          <p>Scan to verify document</p>
          <p className="mt-1 font-medium">Verification Code: {verificationCode}</p>
        </div>
      </CardContent>
    </Card>
  )
} 