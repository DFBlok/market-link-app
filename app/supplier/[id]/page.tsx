"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Star,
  MapPin,
  Phone,
  Mail,
  Globe,
  Award,
  Building2,
  ArrowLeft,
  Send,
  Package,
  Clock,
  CheckCircle,
  Users,
} from "lucide-react"

interface Supplier {
  id: number
  name: string
  category: string
  location: string
  rating: number
  reviewCount: number
  description: string
  specialties: string[]
  certifications: string[]
  phone: string
  email: string
  website: string
  established: string
  employees: string
  responseTime: string
  verified: boolean
  products?: Array<{
    id: number
    name: string
    description: string
    price: string
    moq: string
    leadTime: string
  }>
}

export default function SupplierProfilePage() {
  const params = useParams()
  const router = useRouter()
  const [supplier, setSupplier] = useState<Supplier | null>(null)
  const [loading, setLoading] = useState(true)
  const [inquiryForm, setInquiryForm] = useState({
    productName: "",
    quantity: "",
    message: "",
    priority: "Medium",
    contactEmail: "",
    contactPhone: "",
  })
  const [inquiryStatus, setInquiryStatus] = useState<"idle" | "loading" | "success" | "error">("idle")

  useEffect(() => {
    const fetchSupplier = async () => {
      try {
        const response = await fetch(`/api/suppliers/${params.id}`)
        if (response.ok) {
          const data = await response.json()
          setSupplier(data.supplier)
        } else {
          console.error("Supplier not found")
          router.push("/")
        }
      } catch (error) {
        console.error("Error fetching supplier:", error)
        router.push("/")
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchSupplier()
    }
  }, [params.id, router])

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setInquiryStatus("loading")

    try {
      // Get user data from localStorage
      const userData = localStorage.getItem("user")
      let manufacturerId = "guest"
      let manufacturerName = "Guest User"

      if (userData) {
        const user = JSON.parse(userData)
        manufacturerId = user.id
        manufacturerName = user.name
      }

      const response = await fetch("/api/inquiries", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          manufacturerId,
          manufacturerName,
          supplierId: supplier?.id,
          supplierName: supplier?.name,
          ...inquiryForm,
        }),
      })

      if (response.ok) {
        setInquiryStatus("success")
        setInquiryForm({
          productName: "",
          quantity: "",
          message: "",
          priority: "Medium",
          contactEmail: "",
          contactPhone: "",
        })
      } else {
        setInquiryStatus("error")
      }
    } catch (error) {
      console.error("Error sending inquiry:", error)
      setInquiryStatus("error")
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!supplier) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Supplier Not Found</h2>
          <Link href="/">
            <Button>Return Home</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Search
              </Button>
            </Link>
            <div className="flex items-center space-x-4">
              <Link href="/auth/login">
                <Button variant="outline" size="sm">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Supplier Header */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="flex items-start space-x-6">
              <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center">
                <Building2 className="h-12 w-12 text-gray-600" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <h1 className="text-3xl font-bold text-gray-900">{supplier.name}</h1>
                  {supplier.verified && <Badge variant="secondary">Verified</Badge>}
                </div>
                <div className="flex items-center gap-6 text-gray-600 mb-4">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    {supplier.location}
                  </div>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    {supplier.rating} ({supplier.reviewCount} reviews)
                  </div>
                  <div className="flex items-center gap-1">
                    <Award className="h-4 w-4" />
                    Est. {supplier.established}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    {supplier.employees} employees
                  </div>
                </div>
                <p className="text-gray-700 text-lg mb-4">{supplier.description}</p>
                <div className="flex items-center gap-4">
                  <Badge variant="outline" className="text-sm">
                    {supplier.category}
                  </Badge>
                  <div className="text-sm text-green-600 font-medium">Response time: {supplier.responseTime}</div>
                </div>
              </div>
              <div className="text-right">
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="lg" className="mb-4">
                      <Send className="h-4 w-4 mr-2" />
                      Send Inquiry
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle>Send Inquiry to {supplier.name}</DialogTitle>
                      <DialogDescription>
                        Fill out the form below to send an inquiry to this supplier.
                      </DialogDescription>
                    </DialogHeader>
                    {inquiryStatus === "success" ? (
                      <div className="text-center py-8">
                        <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-green-800 mb-2">Inquiry Sent!</h3>
                        <p className="text-gray-600">
                          Your inquiry has been sent to {supplier.name}. They will respond within{" "}
                          {supplier.responseTime}.
                        </p>
                      </div>
                    ) : (
                      <form onSubmit={handleInquirySubmit} className="space-y-4">
                        <div>
                          <Label htmlFor="productName">Product/Service of Interest</Label>
                          <Input
                            id="productName"
                            value={inquiryForm.productName}
                            onChange={(e) => setInquiryForm((prev) => ({ ...prev, productName: e.target.value }))}
                            placeholder="e.g., Steel Sheets, PCB Assembly"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="quantity">Quantity Required</Label>
                          <Input
                            id="quantity"
                            value={inquiryForm.quantity}
                            onChange={(e) => setInquiryForm((prev) => ({ ...prev, quantity: e.target.value }))}
                            placeholder="e.g., 100 units, 500 kg"
                          />
                        </div>
                        <div>
                          <Label htmlFor="priority">Priority</Label>
                          <Select
                            value={inquiryForm.priority}
                            onValueChange={(value) => setInquiryForm((prev) => ({ ...prev, priority: value }))}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Low">Low</SelectItem>
                              <SelectItem value="Medium">Medium</SelectItem>
                              <SelectItem value="High">High</SelectItem>
                              <SelectItem value="Urgent">Urgent</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="contactEmail">Your Email</Label>
                          <Input
                            id="contactEmail"
                            type="email"
                            value={inquiryForm.contactEmail}
                            onChange={(e) => setInquiryForm((prev) => ({ ...prev, contactEmail: e.target.value }))}
                            placeholder="your@email.com"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="contactPhone">Your Phone (Optional)</Label>
                          <Input
                            id="contactPhone"
                            value={inquiryForm.contactPhone}
                            onChange={(e) => setInquiryForm((prev) => ({ ...prev, contactPhone: e.target.value }))}
                            placeholder="+27 XX XXX XXXX"
                          />
                        </div>
                        <div>
                          <Label htmlFor="message">Message</Label>
                          <Textarea
                            id="message"
                            rows={4}
                            value={inquiryForm.message}
                            onChange={(e) => setInquiryForm((prev) => ({ ...prev, message: e.target.value }))}
                            placeholder="Please provide details about your requirements..."
                            required
                          />
                        </div>
                        <Button type="submit" className="w-full" disabled={inquiryStatus === "loading"}>
                          {inquiryStatus === "loading" ? "Sending..." : "Send Inquiry"}
                        </Button>
                        {inquiryStatus === "error" && (
                          <div className="text-center text-red-600 text-sm">
                            There was an error sending your inquiry. Please try again.
                          </div>
                        )}
                      </form>
                    )}
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Specialties */}
            <Card>
              <CardHeader>
                <CardTitle>Specialties & Capabilities</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  {supplier.specialties.map((specialty, index) => (
                    <Badge key={index} variant="secondary" className="text-sm py-2 px-3">
                      {specialty}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Products & Services */}
            {supplier.products && supplier.products.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Products & Services</CardTitle>
                  <CardDescription>Available offerings from this supplier</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {supplier.products.map((product) => (
                      <div key={product.id} className="p-4 border rounded-lg">
                        <h4 className="font-semibold text-lg text-gray-900 mb-2">{product.name}</h4>
                        <p className="text-gray-600 mb-4">{product.description}</p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <Package className="h-4 w-4 text-gray-400" />
                            <div>
                              <span className="font-medium text-gray-900">Price: </span>
                              <span className="text-gray-600">{product.price}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 text-gray-400" />
                            <div>
                              <span className="font-medium text-gray-900">MOQ: </span>
                              <span className="text-gray-600">{product.moq}</span>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Clock className="h-4 w-4 text-gray-400" />
                            <div>
                              <span className="font-medium text-gray-900">Lead Time: </span>
                              <span className="text-gray-600">{product.leadTime}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Certifications */}
            <Card>
              <CardHeader>
                <CardTitle>Certifications & Standards</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-3">
                  {supplier.certifications.map((cert, index) => (
                    <Badge key={index} variant="outline" className="text-sm py-2 px-3">
                      <Award className="h-3 w-3 mr-2" />
                      {cert}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Contact Information */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Phone</p>
                    <p className="text-sm text-gray-600">{supplier.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Email</p>
                    <p className="text-sm text-gray-600">{supplier.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Globe className="h-5 w-5 text-gray-400" />
                  <div>
                    <p className="text-sm font-medium text-gray-900">Website</p>
                    <p className="text-sm text-blue-600 hover:underline">
                      <a href={`https://${supplier.website}`} target="_blank" rel="noopener noreferrer">
                        {supplier.website}
                      </a>
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Response Time</span>
                  <Badge variant="secondary">{supplier.responseTime}</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Rating</span>
                  <div className="flex items-center gap-1">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span className="text-sm font-medium">{supplier.rating}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Reviews</span>
                  <span className="text-sm font-medium">{supplier.reviewCount}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Established</span>
                  <span className="text-sm font-medium">{supplier.established}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
