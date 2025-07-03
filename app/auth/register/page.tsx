"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, UserPlus, ArrowLeft, CheckCircle } from "lucide-react"
import { FormInput } from "@/components/form-input"
import { registerSchema, type RegisterInput } from "@/lib/validations"
import { toast } from "sonner"

export default function RegisterPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    setValue,
    watch,
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  })

  const userType = watch("userType")

  const onSubmit = async (data: RegisterInput) => {
    setIsLoading(true)

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      const result = await response.json()

      if (response.ok) {
        setSuccess(true)
        toast.success("Account created successfully!")
        setTimeout(() => {
          router.push("/auth/login")
        }, 2000)
      } else {
        if (result.error === "User with this email already exists") {
          setError("email", { message: "This email is already registered" })
        } else {
          setError("root", { message: result.error || "Registration failed" })
        }
        toast.error(result.error || "Registration failed")
      }
    } catch (error) {
      console.error("Registration error:", error)
      setError("root", { message: "An error occurred during registration" })
      toast.error("An error occurred during registration")
    } finally {
      setIsLoading(false)
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardContent className="text-center py-8">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="h-8 w-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-green-800 dark:text-green-400 mb-2">Registration Successful!</h2>
            <p className="text-muted-foreground mb-4">
              Your account has been created successfully. You will be redirected to the login page shortly.
            </p>
            <Button onClick={() => router.push("/auth/login")}>Go to Login</Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>

        <Card>
          <CardHeader className="text-center">
            <CardTitle className="text-2xl font-bold">Create Account</CardTitle>
            <CardDescription>Join the B2B Marketplace and start connecting</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <FormInput
                label="Full Name"
                type="text"
                placeholder="Your full name"
                error={errors.name?.message}
                {...register("name")}
                disabled={isLoading}
              />

              <FormInput
                label="Email"
                type="email"
                placeholder="your@email.com"
                error={errors.email?.message}
                {...register("email")}
                disabled={isLoading}
              />

              <div className="space-y-2">
                <label className="text-sm font-medium">Business Type</label>
                <Select
                  onValueChange={(value) => setValue("userType", value as "manufacturer" | "supplier")}
                  disabled={isLoading}
                >
                  <SelectTrigger className={errors.userType ? "border-red-500" : ""}>
                    <SelectValue placeholder="Select your business type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="manufacturer">Manufacturer</SelectItem>
                    <SelectItem value="supplier">Supplier</SelectItem>
                  </SelectContent>
                </Select>
                {errors.userType && <p className="text-sm text-red-500">{errors.userType.message}</p>}
              </div>

              <FormInput
                label="Password"
                type="password"
                placeholder="Create a password"
                error={errors.password?.message}
                {...register("password")}
                disabled={isLoading}
                description="Must be at least 6 characters"
              />

              <FormInput
                label="Confirm Password"
                type="password"
                placeholder="Confirm your password"
                error={errors.confirmPassword?.message}
                {...register("confirmPassword")}
                disabled={isLoading}
              />

              {errors.root && (
                <Alert variant="destructive">
                  <AlertDescription>{errors.root.message}</AlertDescription>
                </Alert>
              )}

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Create Account
                  </>
                )}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link href="/auth/login" className="text-primary hover:underline font-medium">
                  Sign in here
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
