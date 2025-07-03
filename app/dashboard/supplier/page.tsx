"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Truck,
  Package,
  Users,
  MessageSquare,
  Eye,
  BarChart3,
  Settings,
  LogOut,
  Bell,
  Plus,
  Edit,
  Star,
  MapPin,
  Building2,
  Phone,
  Mail,
  Globe,
  Award,
  Trash2,
  Send,
  FileText,
} from "lucide-react"

interface User {
  id: string
  name: string
  email: string
  userType: string
  companyName?: string
  phone?: string
}

interface Product {
  id: number
  name: string
  category: string
  description: string
  price: string
  moq: string
  leadTime: string
}

interface Inquiry {
  id: number
  manufacturer: string
  product: string
  quantity: string
  status: string
  date: string
  priority: string
  message: string
  contactEmail?: string
  contactPhone?: string
}

// Mock data for supplier profile
const mockProfile = {
  companyName: "TechComponents SA",
  description:
    "Leading supplier of electronic components and PCB assembly services for industrial applications across South Africa.",
  location: "Cape Town, Western Cape",
  phone: "+27 21 123 4567",
  email: "info@techcomponents.co.za",
  website: "www.techcomponents.co.za",
  established: "2015",
  employees: "50-100",
  certifications: ["ISO 9001:2015", "IPC-A-610", "RoHS Compliant"],
  specialties: ["PCB Assembly", "Electronic Components", "Testing Services", "Custom Solutions"],
  rating: 4.9,
  reviewCount: 89,
  responseTime: "< 1 hour",
  verified: true,
}

const initialProducts: Product[] = [
  {
    id: 1,
    name: "PCB Assembly Services",
    category: "Electronics",
    description: "Professional PCB assembly with SMT and through-hole components",
    price: "From R 50 per unit",
    moq: "100 units",
    leadTime: "5-7 days",
  },
  {
    id: 2,
    name: "Electronic Components",
    category: "Electronics",
    description: "Wide range of electronic components including resistors, capacitors, ICs",
    price: "Variable pricing",
    moq: "As per requirement",
    leadTime: "2-3 days",
  },
  {
    id: 3,
    name: "Testing & Quality Assurance",
    category: "Services",
    description: "Comprehensive testing services for electronic assemblies",
    price: "R 200 per hour",
    moq: "1 hour minimum",
    leadTime: "Same day",
  },
]

const initialInquiries: Inquiry[] = [
  {
    id: 1,
    manufacturer: "ABC Manufacturing",
    product: "PCB Assembly Services",
    quantity: "500 units",
    status: "New",
    date: "2024-01-15",
    priority: "High",
    message: "Need quote for 500 units of custom PCB assembly for automotive application.",
    contactEmail: "procurement@abcmfg.co.za",
    contactPhone: "+27 11 555 0123",
  },
  {
    id: 2,
    manufacturer: "XYZ Industries",
    product: "Electronic Components",
    quantity: "Various",
    status: "Quoted",
    date: "2024-01-14",
    priority: "Medium",
    message: "Bulk order for various electronic components for production line.",
    contactEmail: "orders@xyzind.co.za",
    contactPhone: "+27 21 555 0456",
  },
  {
    id: 3,
    manufacturer: "Tech Solutions",
    product: "Testing Services",
    quantity: "10 hours",
    status: "In Progress",
    date: "2024-01-13",
    priority: "Low",
    message: "Quality testing required for new product line.",
    contactEmail: "quality@techsol.co.za",
    contactPhone: "+27 31 555 0789",
  },
]

export default function SupplierDashboard() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState(mockProfile)
  const [editingProfile, setEditingProfile] = useState(false)
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [inquiries, setInquiries] = useState<Inquiry[]>(initialInquiries)

  // Product form states
  const [productDialogOpen, setProductDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [productForm, setProductForm] = useState({
    name: "",
    category: "",
    description: "",
    price: "",
    moq: "",
    leadTime: "",
  })

  // Inquiry response states
  const [responseDialogOpen, setResponseDialogOpen] = useState(false)
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false)
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null)
  const [responseForm, setResponseForm] = useState({
    message: "",
    quotedPrice: "",
    deliveryTime: "",
    additionalNotes: "",
  })

  const router = useRouter()

  useEffect(() => {
    // Check if user is logged in and is a supplier
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/auth/login")
      return
    }

    try {
      const parsedUser = JSON.parse(userData)
      if (parsedUser.userType !== "supplier") {
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

  const handleProfileSave = () => {
    // In a real app, this would save to the backend
    setEditingProfile(false)
    // Show success message
  }

  // Product management functions
  const handleAddProduct = () => {
    setEditingProduct(null)
    setProductForm({
      name: "",
      category: "",
      description: "",
      price: "",
      moq: "",
      leadTime: "",
    })
    setProductDialogOpen(true)
  }

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product)
    setProductForm({
      name: product.name,
      category: product.category,
      description: product.description,
      price: product.price,
      moq: product.moq,
      leadTime: product.leadTime,
    })
    setProductDialogOpen(true)
  }

  const handleSaveProduct = () => {
    if (editingProduct) {
      // Update existing product
      setProducts(products.map((p) => (p.id === editingProduct.id ? { ...editingProduct, ...productForm } : p)))
    } else {
      // Add new product
      const newProduct: Product = {
        id: Math.max(...products.map((p) => p.id)) + 1,
        ...productForm,
      }
      setProducts([...products, newProduct])
    }
    setProductDialogOpen(false)
    setEditingProduct(null)
  }

  const handleDeleteProduct = (productId: number) => {
    setProducts(products.filter((p) => p.id !== productId))
  }

  // Inquiry management functions
  const handleViewDetails = (inquiry: Inquiry) => {
    setSelectedInquiry(inquiry)
    setDetailsDialogOpen(true)
  }

  const handleRespond = (inquiry: Inquiry) => {
    setSelectedInquiry(inquiry)
    setResponseForm({
      message: "",
      quotedPrice: "",
      deliveryTime: "",
      additionalNotes: "",
    })
    setResponseDialogOpen(true)
  }

  const handleSendResponse = () => {
    if (selectedInquiry) {
      // Update inquiry status
      setInquiries(inquiries.map((inq) => (inq.id === selectedInquiry.id ? { ...inq, status: "Responded" } : inq)))
      setResponseDialogOpen(false)
      setSelectedInquiry(null)
      // In a real app, this would send the response to the backend
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "New":
        return "default"
      case "Responded":
      case "Quoted":
        return "secondary"
      case "In Progress":
        return "outline"
      default:
        return "outline"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "High":
        return "destructive"
      case "Medium":
        return "default"
      case "Low":
        return "secondary"
      default:
        return "outline"
    }
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
              <Truck className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-xl font-bold text-gray-900">Supplier Dashboard</h1>
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
              <CardTitle className="text-sm font-medium">Profile Views</CardTitle>
              <Eye className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">1,247</div>
              <p className="text-xs text-muted-foreground">+12% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">New Inquiries</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{inquiries.filter((i) => i.status === "New").length}</div>
              <p className="text-xs text-muted-foreground">+5 this week</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Products</CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{products.length}</div>
              <p className="text-xs text-muted-foreground">3 added this month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Connected Manufacturers</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">89</div>
              <p className="text-xs text-muted-foreground">+7 new connections</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList>
            <TabsTrigger value="profile">Company Profile</TabsTrigger>
            <TabsTrigger value="products">Products & Services</TabsTrigger>
            <TabsTrigger value="inquiries">Inquiries</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Company Profile</CardTitle>
                  <CardDescription>Manage your company information and showcase your capabilities</CardDescription>
                </div>
                <Button
                  variant={editingProfile ? "default" : "outline"}
                  onClick={() => (editingProfile ? handleProfileSave() : setEditingProfile(true))}
                >
                  {editingProfile ? (
                    "Save Changes"
                  ) : (
                    <>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Profile
                    </>
                  )}
                </Button>
              </CardHeader>
              <CardContent className="space-y-6">
                {editingProfile ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="companyName">Company Name</Label>
                        <Input
                          id="companyName"
                          value={profile.companyName}
                          onChange={(e) => setProfile((prev) => ({ ...prev, companyName: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          value={profile.location}
                          onChange={(e) => setProfile((prev) => ({ ...prev, location: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          value={profile.phone}
                          onChange={(e) => setProfile((prev) => ({ ...prev, phone: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          value={profile.email}
                          onChange={(e) => setProfile((prev) => ({ ...prev, email: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="website">Website</Label>
                        <Input
                          id="website"
                          value={profile.website}
                          onChange={(e) => setProfile((prev) => ({ ...prev, website: e.target.value }))}
                        />
                      </div>
                    </div>
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="description">Company Description</Label>
                        <Textarea
                          id="description"
                          rows={6}
                          value={profile.description}
                          onChange={(e) => setProfile((prev) => ({ ...prev, description: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="established">Year Established</Label>
                        <Input
                          id="established"
                          value={profile.established}
                          onChange={(e) => setProfile((prev) => ({ ...prev, established: e.target.value }))}
                        />
                      </div>
                      <div>
                        <Label htmlFor="employees">Number of Employees</Label>
                        <Select
                          value={profile.employees}
                          onValueChange={(value) => setProfile((prev) => ({ ...prev, employees: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1-10">1-10</SelectItem>
                            <SelectItem value="11-50">11-50</SelectItem>
                            <SelectItem value="50-100">50-100</SelectItem>
                            <SelectItem value="100-500">100-500</SelectItem>
                            <SelectItem value="500+">500+</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    {/* Company Header */}
                    <div className="flex items-start space-x-4">
                      <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                        <Building2 className="h-10 w-10 text-gray-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h2 className="text-2xl font-bold text-gray-900">{profile.companyName}</h2>
                          {profile.verified && <Badge variant="secondary">Verified</Badge>}
                        </div>
                        <div className="flex items-center gap-6 text-sm text-gray-600 mb-3">
                          <div className="flex items-center gap-1">
                            <MapPin className="h-4 w-4" />
                            {profile.location}
                          </div>
                          <div className="flex items-center gap-1">
                            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            {profile.rating} ({profile.reviewCount} reviews)
                          </div>
                          <div className="flex items-center gap-1">
                            <Award className="h-4 w-4" />
                            Est. {profile.established}
                          </div>
                        </div>
                        <p className="text-gray-700">{profile.description}</p>
                      </div>
                    </div>

                    {/* Contact Information */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="flex items-center gap-3">
                        <Phone className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Phone</p>
                          <p className="text-sm text-gray-600">{profile.phone}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Mail className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Email</p>
                          <p className="text-sm text-gray-600">{profile.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Globe className="h-5 w-5 text-gray-400" />
                        <div>
                          <p className="text-sm font-medium text-gray-900">Website</p>
                          <p className="text-sm text-gray-600">{profile.website}</p>
                        </div>
                      </div>
                    </div>

                    {/* Specialties */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Specialties</h3>
                      <div className="flex flex-wrap gap-2">
                        {profile.specialties.map((specialty, index) => (
                          <Badge key={index} variant="secondary">
                            {specialty}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Certifications */}
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-3">Certifications</h3>
                      <div className="flex flex-wrap gap-2">
                        {profile.certifications.map((cert, index) => (
                          <Badge key={index} variant="outline">
                            {cert}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="products" className="space-y-6">
            <Card>
              <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div>
                  <CardTitle>Products & Services</CardTitle>
                  <CardDescription>Manage your product catalog and service offerings</CardDescription>
                </div>
                <Button onClick={handleAddProduct} className="w-full sm:w-auto">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {products.map((product) => (
                    <div key={product.id} className="p-4 border rounded-lg">
                      <div className="flex flex-col sm:flex-row items-start justify-between gap-4 mb-3">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{product.name}</h4>
                          <Badge variant="outline" className="mt-1">
                            {product.category}
                          </Badge>
                        </div>
                        <div className="flex gap-2 w-full sm:w-auto">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEditProduct(product)}
                            className="flex-1 sm:flex-none"
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="sm" className="flex-1 sm:flex-none bg-transparent">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Product</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete "{product.name}"? This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDeleteProduct(product.id)}>
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </div>
                      <p className="text-gray-600 mb-3">{product.description}</p>
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="font-medium text-gray-900">Price: </span>
                          <span className="text-gray-600">{product.price}</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-900">MOQ: </span>
                          <span className="text-gray-600">{product.moq}</span>
                        </div>
                        <div>
                          <span className="font-medium text-gray-900">Lead Time: </span>
                          <span className="text-gray-600">{product.leadTime}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Product Add/Edit Dialog */}
            <Dialog open={productDialogOpen} onOpenChange={setProductDialogOpen}>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>{editingProduct ? "Edit Product" : "Add New Product"}</DialogTitle>
                  <DialogDescription>
                    {editingProduct
                      ? "Update your product information"
                      : "Add a new product or service to your catalog"}
                  </DialogDescription>
                </DialogHeader>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="productName">Product Name</Label>
                    <Input
                      id="productName"
                      value={productForm.name}
                      onChange={(e) => setProductForm((prev) => ({ ...prev, name: e.target.value }))}
                      placeholder="e.g., PCB Assembly Services"
                    />
                  </div>
                  <div>
                    <Label htmlFor="productCategory">Category</Label>
                    <Select
                      value={productForm.category}
                      onValueChange={(value) => setProductForm((prev) => ({ ...prev, category: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Electronics">Electronics</SelectItem>
                        <SelectItem value="Raw Materials">Raw Materials</SelectItem>
                        <SelectItem value="Services">Services</SelectItem>
                        <SelectItem value="Manufacturing">Manufacturing</SelectItem>
                        <SelectItem value="Components">Components</SelectItem>
                        <SelectItem value="Other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="sm:col-span-2">
                    <Label htmlFor="productDescription">Description</Label>
                    <Textarea
                      id="productDescription"
                      rows={3}
                      value={productForm.description}
                      onChange={(e) => setProductForm((prev) => ({ ...prev, description: e.target.value }))}
                      placeholder="Describe your product or service..."
                    />
                  </div>
                  <div>
                    <Label htmlFor="productPrice">Price</Label>
                    <Input
                      id="productPrice"
                      value={productForm.price}
                      onChange={(e) => setProductForm((prev) => ({ ...prev, price: e.target.value }))}
                      placeholder="e.g., From R 50 per unit"
                    />
                  </div>
                  <div>
                    <Label htmlFor="productMoq">Minimum Order Quantity</Label>
                    <Input
                      id="productMoq"
                      value={productForm.moq}
                      onChange={(e) => setProductForm((prev) => ({ ...prev, moq: e.target.value }))}
                      placeholder="e.g., 100 units"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <Label htmlFor="productLeadTime">Lead Time</Label>
                    <Input
                      id="productLeadTime"
                      value={productForm.leadTime}
                      onChange={(e) => setProductForm((prev) => ({ ...prev, leadTime: e.target.value }))}
                      placeholder="e.g., 5-7 days"
                    />
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 pt-4">
                  <Button
                    onClick={handleSaveProduct}
                    className="flex-1"
                    disabled={!productForm.name || !productForm.category || !productForm.description}
                  >
                    {editingProduct ? "Update Product" : "Add Product"}
                  </Button>
                  <Button variant="outline" onClick={() => setProductDialogOpen(false)} className="flex-1">
                    Cancel
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </TabsContent>

          <TabsContent value="inquiries">
            <Card>
              <CardHeader>
                <CardTitle>Manufacturer Inquiries</CardTitle>
                <CardDescription>Manage inquiries from manufacturers</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {inquiries.map((inquiry) => (
                    <div key={inquiry.id} className="p-4 border rounded-lg">
                      <div className="flex flex-col lg:flex-row items-start justify-between gap-4 mb-3">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{inquiry.product}</h4>
                          <p className="text-sm text-gray-600">From: {inquiry.manufacturer}</p>
                          <p className="text-sm text-gray-600">Quantity: {inquiry.quantity}</p>
                          <p className="text-xs text-gray-500">Received: {inquiry.date}</p>
                        </div>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 w-full lg:w-auto">
                          <div className="flex gap-2">
                            <Badge variant={getStatusColor(inquiry.status)}>{inquiry.status}</Badge>
                            <Badge variant={getPriorityColor(inquiry.priority)}>{inquiry.priority}</Badge>
                          </div>
                        </div>
                      </div>
                      <p className="text-gray-700 mb-3">{inquiry.message}</p>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleRespond(inquiry)}
                          className="flex-1 sm:flex-none"
                          disabled={inquiry.status === "Responded"}
                        >
                          <Send className="h-4 w-4 mr-2" />
                          {inquiry.status === "Responded" ? "Responded" : "Respond"}
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleViewDetails(inquiry)}
                          className="flex-1 sm:flex-none"
                        >
                          <FileText className="h-4 w-4 mr-2" />
                          View Details
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Response Dialog */}
            <Dialog open={responseDialogOpen} onOpenChange={setResponseDialogOpen}>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Respond to Inquiry</DialogTitle>
                  <DialogDescription>
                    Send a response to {selectedInquiry?.manufacturer} regarding their inquiry for{" "}
                    {selectedInquiry?.product}
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="responseMessage">Response Message</Label>
                    <Textarea
                      id="responseMessage"
                      rows={4}
                      value={responseForm.message}
                      onChange={(e) => setResponseForm((prev) => ({ ...prev, message: e.target.value }))}
                      placeholder="Thank you for your inquiry. We would be happy to provide..."
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="quotedPrice">Quoted Price (Optional)</Label>
                      <Input
                        id="quotedPrice"
                        value={responseForm.quotedPrice}
                        onChange={(e) => setResponseForm((prev) => ({ ...prev, quotedPrice: e.target.value }))}
                        placeholder="e.g., R 25,000 for 500 units"
                      />
                    </div>
                    <div>
                      <Label htmlFor="deliveryTime">Delivery Time</Label>
                      <Input
                        id="deliveryTime"
                        value={responseForm.deliveryTime}
                        onChange={(e) => setResponseForm((prev) => ({ ...prev, deliveryTime: e.target.value }))}
                        placeholder="e.g., 2-3 weeks"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="additionalNotes">Additional Notes (Optional)</Label>
                    <Textarea
                      id="additionalNotes"
                      rows={2}
                      value={responseForm.additionalNotes}
                      onChange={(e) => setResponseForm((prev) => ({ ...prev, additionalNotes: e.target.value }))}
                      placeholder="Any additional information or requirements..."
                    />
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 pt-4">
                  <Button onClick={handleSendResponse} className="flex-1" disabled={!responseForm.message}>
                    <Send className="h-4 w-4 mr-2" />
                    Send Response
                  </Button>
                  <Button variant="outline" onClick={() => setResponseDialogOpen(false)} className="flex-1">
                    Cancel
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            {/* Details Dialog */}
            <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Inquiry Details</DialogTitle>
                  <DialogDescription>Complete information about this inquiry</DialogDescription>
                </DialogHeader>
                {selectedInquiry && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <Label className="text-sm font-medium text-gray-900">Manufacturer</Label>
                        <p className="text-sm text-gray-600">{selectedInquiry.manufacturer}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-900">Product/Service</Label>
                        <p className="text-sm text-gray-600">{selectedInquiry.product}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-900">Quantity</Label>
                        <p className="text-sm text-gray-600">{selectedInquiry.quantity}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-900">Date Received</Label>
                        <p className="text-sm text-gray-600">{selectedInquiry.date}</p>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-900">Status</Label>
                        <Badge variant={getStatusColor(selectedInquiry.status)} className="mt-1">
                          {selectedInquiry.status}
                        </Badge>
                      </div>
                      <div>
                        <Label className="text-sm font-medium text-gray-900">Priority</Label>
                        <Badge variant={getPriorityColor(selectedInquiry.priority)} className="mt-1">
                          {selectedInquiry.priority}
                        </Badge>
                      </div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-gray-900">Message</Label>
                      <p className="text-sm text-gray-600 mt-1 p-3 bg-gray-50 rounded-md">{selectedInquiry.message}</p>
                    </div>
                    {selectedInquiry.contactEmail && (
                      <div>
                        <Label className="text-sm font-medium text-gray-900">Contact Email</Label>
                        <p className="text-sm text-gray-600">{selectedInquiry.contactEmail}</p>
                      </div>
                    )}
                    {selectedInquiry.contactPhone && (
                      <div>
                        <Label className="text-sm font-medium text-gray-900">Contact Phone</Label>
                        <p className="text-sm text-gray-600">{selectedInquiry.contactPhone}</p>
                      </div>
                    )}
                  </div>
                )}
                <div className="flex justify-end pt-4">
                  <Button variant="outline" onClick={() => setDetailsDialogOpen(false)}>
                    Close
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </TabsContent>

          <TabsContent value="analytics">
            <Card>
              <CardHeader>
                <CardTitle>Business Analytics</CardTitle>
                <CardDescription>Track your performance and growth metrics</CardDescription>
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
