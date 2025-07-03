"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Factory,
  Search,
  TrendingUp,
  Users,
  MessageSquare,
  ShoppingCart,
  BarChart3,
  Settings,
  LogOut,
  Bell,
  Star,
  MapPin,
  Building2,
  Eye,
  Send,
} from "lucide-react"

interface User {
  id: string
  name: string
  email: string
  userType: string
  companyName?: string
  phone?: string
}

// Mock supplier data
const mockSuppliers = [
  {
    id: 1,
    name: "SteelCorp Manufacturing",
    category: "Raw Materials",
    location: "Johannesburg, GP",
    rating: 4.8,
    reviewCount: 127,
    description: "Leading supplier of high-grade steel and metal components.",
    specialties: ["Steel Sheets", "Metal Fabrication", "Custom Parts"],
    responseTime: "< 2 hours",
    verified: true,
    lastActive: "2 hours ago",
  },
  {
    id: 2,
    name: "TechComponents SA",
    category: "Electronics",
    location: "Cape Town, WC",
    rating: 4.9,
    reviewCount: 89,
    description: "Specialized electronic components and circuit boards.",
    specialties: ["PCB Assembly", "Electronic Components", "Testing Services"],
    responseTime: "< 1 hour",
    verified: true,
    lastActive: "1 hour ago",
  },
  {
    id: 3,
    name: "Precision Tools Ltd",
    category: "Tools & Equipment",
    location: "Durban, KZN",
    rating: 4.7,
    reviewCount: 156,
    description: "Precision manufacturing tools and equipment.",
    specialties: ["CNC Tools", "Precision Instruments", "Calibration Services"],
    responseTime: "< 3 hours",
    verified: true,
    lastActive: "30 minutes ago",
  },
]

const mockInquiries = [
  {
    id: 1,
    supplier: "SteelCorp Manufacturing",
    product: "Steel Sheets - Grade 304",
    status: "Pending Response",
    date: "2024-01-15",
    priority: "High",
  },
  {
    id: 2,
    supplier: "TechComponents SA",
    product: "PCB Assembly Services",
    status: "Quote Received",
    date: "2024-01-14",
    priority: "Medium",
  },
  {
    id: 3,
    supplier: "Precision Tools Ltd",
    product: "CNC Cutting Tools",
    status: "In Discussion",
    date: "2024-01-13",
    priority: "Low",
  },
]

export default function ManufacturerDashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All Categories")
  const [filteredSuppliers, setFilteredSuppliers] = useState(mockSuppliers)
  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in and is a manufacturer
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/auth/login")
      return
    }

    try {
      const parsedUser = JSON.parse(userData)
      if (parsedUser.userType !== "manufacturer") {
        router.push("/auth/login")
        return
      }
      setUser(parsedUser)
    } catch (error) {
      console.error("Error parsing user data:", error)
      router.push("/auth/login")
      return
    } finally {
      setLoading(false)
    }
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("user")
    router.push("/")
  }

  const handleSearch = () => {
    let filtered = mockSuppliers

    if (searchQuery) {
      filtered = filtered.filter(
        (supplier) =>
          supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          supplier.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          supplier.specialties.some((specialty) => specialty.toLowerCase().includes(searchQuery.toLowerCase())),
      )
    }

    if (selectedCategory !== "All Categories") {
      filtered = filtered.filter((supplier) => supplier.category === selectedCategory)
    }

    setFilteredSuppliers(filtered)
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Factory className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Manufacturer Dashboard</h1>
                <p className="text-sm text-gray-500">Welcome back, {user.name}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Bell className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Inquiries</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">+3 new this week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Connected Suppliers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">47</div>
              <p className="text-xs text-muted-foreground">+5 new connections</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Quotes</CardTitle>
              <ShoppingCart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">Awaiting responses</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Cost Savings</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">R 234K</div>
              <p className="text-xs text-muted-foreground">This quarter</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="discover" className="space-y-6">
          <TabsList>
            <TabsTrigger value="discover">Discover Suppliers</TabsTrigger>
            <TabsTrigger value="inquiries">My Inquiries</TabsTrigger>
            <TabsTrigger value="connections">Connections</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="discover" className="space-y-6">
            {/* Search and Filter */}
            <Card>
              <CardHeader>
                <CardTitle>Find Suppliers</CardTitle>
                <CardDescription>Search and filter suppliers based on your requirements</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <Input
                    placeholder="Search suppliers, products, services..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="All Categories">All Categories</SelectItem>
                      <SelectItem value="Raw Materials">Raw Materials</SelectItem>
                      <SelectItem value="Electronics">Electronics</SelectItem>
                      <SelectItem value="Tools & Equipment">Tools & Equipment</SelectItem>
                      <SelectItem value="Chemicals">Chemicals</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button onClick={handleSearch}>
                    <Search className="h-4 w-4 mr-2" />
                    Search
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Supplier Results */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {filteredSuppliers.map((supplier) => (
                <Card key={supplier.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                          <Building2 className="h-6 w-6 text-gray-600" />
                        </div>
                        <div>
                          <CardTitle className="text-lg flex items-center gap-2">
                            {supplier.name}
                            {supplier.verified && (
                              <Badge variant="secondary" className="text-xs">
                                Verified
                              </Badge>
                            )}
                          </CardTitle>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <MapPin className="h-4 w-4" />
                              {supplier.location}
                            </div>
                            <div className="flex items-center gap-1">
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              {supplier.rating} ({supplier.reviewCount})
                            </div>
                          </div>
                        </div>
                      </div>
                      <Badge variant="outline">{supplier.category}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">{supplier.description}</p>

                    <div className="space-y-3">
                      <div>
                        <h4 className="font-medium text-sm text-gray-900 mb-2">Specialties</h4>
                        <div className="flex flex-wrap gap-2">
                          {supplier.specialties.map((specialty, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {specialty}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="text-sm text-gray-600">
                          Response: <span className="font-medium text-green-600">{supplier.responseTime}</span>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline">
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Button>
                          <Button size="sm">
                            <Send className="h-4 w-4 mr-2" />
                            Inquire
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="inquiries">
            <Card>
              <CardHeader>
                <CardTitle>My Inquiries</CardTitle>
                <CardDescription>Track your supplier inquiries and responses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockInquiries.map((inquiry) => (
                    <div key={inquiry.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium">{inquiry.product}</h4>
                        <p className="text-sm text-gray-600">{inquiry.supplier}</p>
                        <p className="text-xs text-gray-500">Sent on {inquiry.date}</p>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge
                          variant={
                            inquiry.status === "Quote Received"
                              ? "default"
                              : inquiry.status === "In Discussion"
                                ? "secondary"
                                : "outline"
                          }
                        >
                          {inquiry.status}
                        </Badge>
                        <Badge
                          variant={
                            inquiry.priority === "High"
                              ? "destructive"
                              : inquiry.priority === "Medium"
                                ? "default"
                                : "secondary"
                          }
                        >
                          {inquiry.priority}
                        </Badge>
                        <Button size="sm" variant="outline">
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="connections">
            <Card>
              <CardHeader>
                <CardTitle>Connected Suppliers</CardTitle>
                <CardDescription>Manage your established supplier relationships</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {mockSuppliers.map((supplier) => (
                    <div key={supplier.id} className="p-4 border rounded-lg">
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-10 h-10 bg-gray-200 rounded-lg flex items-center justify-center">
                          <Building2 className="h-5 w-5 text-gray-600" />
                        </div>
                        <div>
                          <h4 className="font-medium">{supplier.name}</h4>
                          <p className="text-sm text-gray-600">{supplier.category}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="text-xs text-gray-500">Last active: {supplier.lastActive}</div>
                        <Button size="sm" variant="outline">
                          Message
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Sourcing Analytics</CardTitle>
                <CardDescription>View detailed insights about your sourcing activities</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Analytics dashboard coming soon...</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
