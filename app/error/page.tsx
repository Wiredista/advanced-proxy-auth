"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { AlertTriangle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Footer from "@/components/footer"

// Dictionary of error codes, names, and messages
const errorDictionary: Record<string, { name: string; message: string }> = {
  "400": {
    name: "Bad Request",
    message: "The server cannot process the request due to a client error.",
  },
  "401": {
    name: "Unauthorized",
    message: "Authentication is required and has failed or has not been provided.",
  },
  "403": {
    name: "Forbidden",
    message: "You don't have permission to access this resource.",
  },
  "404": {
    name: "Not Found",
    message: "The requested resource could not be found on this server.",
  },
  "500": {
    name: "Internal Server Error",
    message: "The server encountered an unexpected condition that prevented it from fulfilling the request.",
  },
  "501": {
    name: "Not Implemented",
    message: "The server does not support the functionality required to fulfill the request.",
  },
  "502": {
    name: "Bad Gateway",
    message: "The server received an invalid response from an upstream server.",
  },
  "503": {
    name: "Service Unavailable",
    message: "The server is currently unable to handle the request due to temporary overloading or maintenance.",
  },
  "504": {
    name: "Gateway Timeout",
    message: "The server did not receive a timely response from an upstream server.",
  },
}

export default function ErrorPage() {
  const searchParams = useSearchParams()
  const [errorInfo, setErrorInfo] = useState({
    code: "500",
    name: "Internal Server Error",
    message: "An unexpected error occurred.",
  })
  const [redirectPage, setRedirectPage] = useState("/")
  const redirect = searchParams.get("redirect")
  const redirectURL = `/?redirect=${encodeURIComponent(redirect || "/")}`
  
  useEffect(() => {
    setRedirectPage(redirectURL)
  }, [redirectURL])

  useEffect(() => {
    const errorCode = searchParams.get("error") || "500"

    if (errorDictionary[errorCode]) {
      setErrorInfo({
        code: errorCode,
        name: errorDictionary[errorCode].name,
        message: errorDictionary[errorCode].message,
      })
    } else {
      setErrorInfo({
        code: errorCode,
        name: "Unknown Error",
        message: "An unexpected error occurred.",
      })
    }
  }, [searchParams])

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gray-50">
      <div className="w-full max-w-md">
        <Card className="w-full">
          <CardHeader className="space-y-1">
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-red-100 p-3">
                <AlertTriangle className="h-6 w-6 text-red-600" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-center">Error {errorInfo.code}</CardTitle>
            <CardDescription className="text-center font-medium text-red-600">{errorInfo.name}</CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="mb-6">{errorInfo.message}</p>
            <Button asChild className="w-full">
              <Link href={redirectPage}>Return to Login</Link>
            </Button>
          </CardContent>
          <CardFooter className="flex justify-center pt-0">
            <p className="text-sm text-gray-500">
              If you believe this is a mistake, please contact your system administrator.
            </p>
          </CardFooter>
        </Card>
      </div>
      <Footer />
    </main>
  )
}

