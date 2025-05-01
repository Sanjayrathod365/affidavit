"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowLeft, CheckCircle, XCircle } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"

interface VerifyPageProps {
  params: {
    documentId: string
    code: string
  }
}

export default function VerifyPage({ params }: VerifyPageProps) {
  const router = useRouter()
  const [isVerifying, setIsVerifying] = useState(true)
  const [isVerified, setIsVerified] = useState(false)
  const [documentDetails, setDocumentDetails] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const verifyDocument = async () => {
      try {
        const response = await fetch('/api/verify', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            documentId: params.documentId,
            verificationCode: params.code,
          }),
        })

        const result = await response.json()
        
        if (!response.ok) {
          throw new Error(result.error || 'Verification failed')
        }
        
        if (result.data?.verified) {
          setIsVerified(true)
          setDocumentDetails(result.data.document)
          toast.success("Document verified successfully!")
        } else {
          setIsVerified(false)
          setError("Verification failed. The document ID or verification code is invalid.")
          toast.error("Verification failed")
        }
      } catch (error) {
        console.error("Verification failed:", error)
        setIsVerified(false)
        setError(error instanceof Error ? error.message : "Document verification failed")
        toast.error("Verification failed")
      } finally {
        setIsVerifying(false)
      }
    }

    verifyDocument()
  }, [params.documentId, params.code])

  return (
    <div className="container py-8">
      <div className="mb-6">
        <Link href="/">
          <Button variant="ghost" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Button>
        </Link>
      </div>

      <div className="mb-8">
        <h1 className="text-3xl font-bold">Document Verification</h1>
        <p className="text-muted-foreground mt-2">
          Automatically verifying document authenticity
        </p>
      </div>

      <div className="max-w-lg mx-auto">
        {isVerifying ? (
          <Card>
            <CardHeader>
              <CardTitle>Verifying Document</CardTitle>
              <CardDescription>
                Please wait while we verify the document...
              </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-center py-6">
              <div className="animate-pulse flex space-x-4">
                <div className="rounded-full bg-slate-200 h-10 w-10"></div>
                <div className="flex-1 space-y-4 py-1">
                  <div className="h-4 bg-slate-200 rounded w-3/4"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-slate-200 rounded"></div>
                    <div className="h-4 bg-slate-200 rounded w-5/6"></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : isVerified ? (
          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <div className="flex items-center gap-3">
                <CheckCircle className="h-6 w-6 text-green-600" />
                <CardTitle>Document Verified</CardTitle>
              </div>
              <CardDescription>
                This document has been verified as authentic
              </CardDescription>
            </CardHeader>
            <CardContent>
              {documentDetails && (
                <div className="mt-4 p-4 bg-white rounded-md">
                  <h3 className="font-medium text-gray-900 mb-2">Document Details</h3>
                  <dl className="divide-y divide-gray-200">
                    <div className="py-2 flex justify-between">
                      <dt className="text-sm font-medium text-gray-500">Patient:</dt>
                      <dd className="text-sm text-gray-900">{documentDetails.patientName}</dd>
                    </div>
                    <div className="py-2 flex justify-between">
                      <dt className="text-sm font-medium text-gray-500">Provider:</dt>
                      <dd className="text-sm text-gray-900">{documentDetails.providerName}</dd>
                    </div>
                    <div className="py-2 flex justify-between">
                      <dt className="text-sm font-medium text-gray-500">Status:</dt>
                      <dd className="text-sm text-gray-900">{documentDetails.status}</dd>
                    </div>
                    <div className="py-2 flex justify-between">
                      <dt className="text-sm font-medium text-gray-500">Created:</dt>
                      <dd className="text-sm text-gray-900">
                        {new Date(documentDetails.createdAt).toLocaleDateString()}
                      </dd>
                    </div>
                  </dl>
                </div>
              )}
            </CardContent>
          </Card>
        ) : (
          <Card className="border-red-200 bg-red-50">
            <CardHeader>
              <div className="flex items-center gap-3">
                <XCircle className="h-6 w-6 text-red-600" />
                <CardTitle>Verification Failed</CardTitle>
              </div>
              <CardDescription>
                We couldn't verify this document
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-red-700 mb-4">
                {error || "The document ID or verification code is invalid."}
              </p>
              <Button 
                onClick={() => router.push('/verification')}
                variant="outline"
              >
                Try Manual Verification
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
} 