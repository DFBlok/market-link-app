"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"

interface AuthGuardProps {
  children: React.ReactNode
  requiredUserType?: "manufacturer" | "supplier"
}

export default function AuthGuard({ children, requiredUserType }: AuthGuardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = () => {
      try {
        const userData = localStorage.getItem("user")

        if (!userData) {
          router.push("/auth/login")
          return
        }

        const user = JSON.parse(userData)

        if (requiredUserType && user.userType !== requiredUserType) {
          // Redirect to correct dashboard based on user type
          if (user.userType === "manufacturer") {
            router.push("/dashboard/manufacturer")
          } else if (user.userType === "supplier") {
            router.push("/dashboard/supplier")
          } else {
            router.push("/auth/login")
          }
          return
        }

        setIsAuthenticated(true)
      } catch (error) {
        console.error("Auth check error:", error)
        router.push("/auth/login")
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [router, requiredUserType])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return <>{children}</>
}
