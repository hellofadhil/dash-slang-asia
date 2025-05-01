"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle } from "lucide-react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { toast } from "react-toastify"

export default function VerifySuccessPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get("email")

  useEffect(() => {
    toast.success("Email verification successful! You can now log in.")
  }, [])

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="w-full max-w-md p-4">
        <Card>
          <CardHeader className="space-y-1">
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <CardTitle className="text-2xl font-bold text-center">Email Verified!</CardTitle>
            <CardDescription className="text-center">Your email has been successfully verified.</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p>You can now log in to your account with your email and password.</p>
            {email && <p className="mt-2 font-medium">{email}</p>}
          </CardContent>
          <CardFooter className="flex justify-center">
            <Button asChild>
              <Link href="/auth/login">Go to Login</Link>
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

