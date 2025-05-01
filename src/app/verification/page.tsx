"use client"

import { useState } from "react"
import { VerificationForm } from "@/components/VerificationForm"
import { Button } from "@/components/ui/button"
import { ArrowLeft, CheckCircle, ExternalLink } from "lucide-react"
import Link from "next/link"

export default function VerificationPage() {
  const [isVerified, setIsVerified] = useState<boolean | null>(null)

  const handleVerification = (verified: boolean) => {
    setIsVerified(verified)
  }

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
          Verify the authenticity of affidavit documents using the unique document ID and verification code
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div>
          {isVerified === null ? (
            <VerificationForm onVerify={handleVerification} />
          ) : (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 shadow-sm">
              <div className="flex items-center gap-3 mb-4">
                <CheckCircle className="h-6 w-6 text-green-600" />
                <h2 className="text-xl font-semibold text-green-800">Verification Successful</h2>
              </div>
              <p className="text-green-700 mb-6">
                The document has been successfully verified as authentic. The verification details are displayed
                on the form.
              </p>
              <Button 
                variant="outline" 
                className="border-green-300 hover:border-green-400 hover:bg-green-100"
                onClick={() => setIsVerified(null)}
              >
                Verify Another Document
              </Button>
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-gray-50 p-6 rounded-lg">
            <h2 className="text-xl font-bold mb-4">About Document Verification</h2>
            <div className="space-y-4">
              <p>
                This verification system allows you to confirm the authenticity of affidavit documents issued
                through our platform.
              </p>
              <div>
                <h3 className="font-semibold mb-2">How to verify a document:</h3>
                <ol className="list-decimal pl-6 space-y-2">
                  <li>Enter the Document ID found at the top of the affidavit document</li>
                  <li>Enter the Verification Code provided with the document</li>
                  <li>Click "Verify Document" to check authenticity</li>
                </ol>
              </div>
              <p>
                If verification is successful, you will see details about the document, including patient and provider
                information, which you can compare to the physical document to ensure validity.
              </p>
            </div>
          </div>
          
          <div className="bg-blue-50 p-6 rounded-lg border border-blue-100">
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <ExternalLink className="h-5 w-5 text-blue-600" />
              Direct URL Verification
            </h2>
            <div className="space-y-4">
              <p>
                You can also verify documents directly through a URL. If you received a QR code or a verification link,
                you can use it to verify the document without manually entering the details.
              </p>
              <div>
                <h3 className="font-semibold mb-2">Direct verification URL format:</h3>
                <code className="block bg-white p-2 rounded border border-blue-200 text-sm">
                  https://yoursite.com/verify/[documentId]/[verificationCode]
                </code>
              </div>
              <p className="text-sm text-blue-700">
                Note: Scanning the QR code on the document will automatically take you to the verification page
                with pre-filled information.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
} 