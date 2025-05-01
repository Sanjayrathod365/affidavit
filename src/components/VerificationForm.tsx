"use client"

import { z } from "zod"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { useVerification } from "@/hooks/useVerification"
import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"

// Validation schema for verification
const verificationSchema = z.object({
  documentId: z.string().min(1, "Document ID is required"),
  verificationCode: z.string().min(6, "Verification code must be at least 6 characters"),
})

type VerificationFormValues = z.infer<typeof verificationSchema>

interface VerificationFormProps {
  onVerify: (verified: boolean) => void
}

export function VerificationForm({ onVerify }: VerificationFormProps) {
  const { verifyDocument, isLoading, result } = useVerification()
  const searchParams = useSearchParams()
  const [initialized, setInitialized] = useState(false)

  const form = useForm<VerificationFormValues>({
    resolver: zodResolver(verificationSchema),
    defaultValues: {
      documentId: "",
      verificationCode: "",
    },
  })

  // Set form values from URL parameters when component mounts
  useEffect(() => {
    if (!initialized && searchParams) {
      const documentId = searchParams.get("documentId") || ""
      const verificationCode = searchParams.get("code") || ""
      
      if (documentId) {
        form.setValue("documentId", documentId)
      }
      
      if (verificationCode) {
        form.setValue("verificationCode", verificationCode)
      }
      
      // Auto-submit if both fields are filled
      if (documentId && verificationCode && verificationCode.length >= 6) {
        form.handleSubmit(onSubmit)()
      }
      
      setInitialized(true)
    }
  }, [searchParams, form, initialized])

  async function onSubmit(data: VerificationFormValues) {
    try {
      const verificationResult = await verifyDocument(data)
      
      if (verificationResult?.verified) {
        toast.success("Document verified successfully!")
        onVerify(true)
      } else {
        toast.error("Verification failed. Please check your details and try again.")
        onVerify(false)
      }
    } catch (error) {
      console.error("Verification failed:", error)
      toast.error(error instanceof Error ? error.message : "Document verification failed")
      onVerify(false)
    }
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Verify Document</CardTitle>
        <CardDescription>
          Enter the document ID and verification code to verify authenticity
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="documentId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Document ID</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter document ID" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="verificationCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Verification Code</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter verification code" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? "Verifying..." : "Verify Document"}
            </Button>

            {result?.document && (
              <div className="mt-4 p-4 bg-gray-50 rounded-md">
                <h3 className="font-medium text-gray-900">Document Details</h3>
                <dl className="mt-2 divide-y divide-gray-200">
                  <div className="py-2 flex justify-between">
                    <dt className="text-sm font-medium text-gray-500">Patient:</dt>
                    <dd className="text-sm text-gray-900">{result.document.patientName}</dd>
                  </div>
                  <div className="py-2 flex justify-between">
                    <dt className="text-sm font-medium text-gray-500">Provider:</dt>
                    <dd className="text-sm text-gray-900">{result.document.providerName}</dd>
                  </div>
                  <div className="py-2 flex justify-between">
                    <dt className="text-sm font-medium text-gray-500">Status:</dt>
                    <dd className="text-sm text-gray-900">{result.document.status}</dd>
                  </div>
                  <div className="py-2 flex justify-between">
                    <dt className="text-sm font-medium text-gray-500">Created:</dt>
                    <dd className="text-sm text-gray-900">
                      {new Date(result.document.createdAt).toLocaleDateString()}
                    </dd>
                  </div>
                </dl>
              </div>
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  )
} 