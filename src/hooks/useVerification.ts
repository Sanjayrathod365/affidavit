"use client"

import { useState } from "react"

export interface VerificationParams {
  documentId: string
  verificationCode: string
}

export interface VerificationResult {
  verified: boolean
  document?: {
    id: string
    createdAt: string
    status: string
    patientName?: string
    providerName?: string
  }
}

export function useVerification() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<VerificationResult | null>(null)

  const verifyDocument = async (params: VerificationParams): Promise<VerificationResult | null> => {
    setIsLoading(true)
    setError(null)
    
    try {
      const response = await fetch('/api/verify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      })

      const responseData = await response.json()
      
      if (!response.ok) {
        const errorMessage = responseData.error || 'Verification failed'
        setError(errorMessage)
        setResult(null)
        return null
      }
      
      const verificationResult: VerificationResult = {
        verified: !!responseData.data?.verified,
        document: responseData.data?.document,
      }
      
      setResult(verificationResult)
      return verificationResult
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to verify document'
      setError(errorMessage)
      setResult(null)
      return null
    } finally {
      setIsLoading(false)
    }
  }

  const reset = () => {
    setError(null)
    setResult(null)
  }

  return {
    verifyDocument,
    isLoading,
    error,
    result,
    reset,
  }
} 