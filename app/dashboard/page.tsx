"use client"

import { ReactNode, useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Building2,
  Package,
  MessageSquare,
  TrendingUp,
  Star,
  LogOut,
  Plus,
  Edit,
  Trash2,
  Eye,
  Reply,
} from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { toast } from "sonner"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { FormInput } from "@/components/form-input"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { productSchema, inquiryResponseSchema, type ProductInput, type InquiryResponseInput } from "@/lib/validations"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import SupplierDashboard from "@/app/dashboard/supplier/page"
import Orders from "@/app/dashboard/components/order"
import CreateOrderForm from "./components/CreateOrderForm"
//**************************************IMPORTS
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const mockMetrics = [
  { label: "Products", value: 42 },
  { label: "Orders", value: 18 },
  { label: "Revenue", value: "R12,500" },
  { label: "Avg Rating", value: "4.2★" },
];

const chartData = [
  { name: "Week 1", Orders: 4 },
  { name: "Week 2", Orders: 7 },
  { name: "Week 3", Orders: 3 },
  { name: "Week 4", Orders: 4 },
];
const supplierId = 13;


//**************************************INTERFACES
interface User {
  id: number
  name: string
  email: string
  userType: "manufacturer" | "supplier"
}

interface Product {
  status: string
  stock: ReactNode
  id: number
  name: string
  description: string
  category: string
  price: string
  leadTime: string
  minOrderQuantity: string
  createdAt: string
}

interface Inquiry {
  id: number
  manufacturerId: number
  supplierId: number
  subject: string
  message: string
  priority: "low" | "medium" | "high"
  status: "pending" | "responded" | "closed"
  manufacturerName: string
  manufacturerEmail: string
  response?: string
  quotedPrice?: string
  deliveryTime?: string
  notes?: string
  createdAt: string
  respondedAt?: string
}

const mockInquiries: Inquiry[] = [
  {
    id: 1,
    manufacturerId: 1,
    supplierId: 2,
    subject: "Steel Components Inquiry",
    message: "We need high-grade steel sheets for our manufacturing process. Please provide pricing and availability.",
    priority: "high",
    status: "pending",
    manufacturerName: "TechCorp Manufacturing",
    manufacturerEmail: "procurement@techcorp.com",
    createdAt: "2024-01-15T10:30:00Z",
  },
  {
    id: 2,
    manufacturerId: 3,
    supplierId: 2,
    subject: "Custom Parts Request",
    message: "Looking for custom metal fabrication services for automotive parts.",
    priority: "medium",
    status: "responded",
    manufacturerName: "AutoParts SA",
    manufacturerEmail: "orders@autoparts.co.za",
    response: "We can definitely help with custom fabrication. Please find our quote attached.",
    quotedPrice: "R 25,000",
    deliveryTime: "2-3 weeks",
    createdAt: "2024-01-14T14:20:00Z",
    respondedAt: "2024-01-14T16:45:00Z",
  },
]

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null)
  const [products, setProducts] = useState<Product[]>([])
  const [inquiries, setInquiries] = useState<Inquiry[]>(mockInquiries)
  const [isProductDialogOpen, setIsProductDialogOpen] = useState(false)
  const [isInquiryDialogOpen, setIsInquiryDialogOpen] = useState(false)
  const [isResponseDialogOpen, setIsResponseDialogOpen] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [selectedInquiry, setSelectedInquiry] = useState<Inquiry | null>(null)
  const [showDialog, setShowDialog] = useState(false)
  const router = useRouter()

  const productForm = useForm<ProductInput>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      category: "",
      price: "",
      leadTime: "",
      minOrderQuantity: "",
    },
  })

  const responseForm = useForm<InquiryResponseInput>({
    resolver: zodResolver(inquiryResponseSchema),
    defaultValues: {
      message: "",
      quotedPrice: "",
      deliveryTime: "",
      notes: "",
    },
  })

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData)
        setUser(parsedUser)
        // Load user-specific data
        loadProducts(parsedUser.id)
      } catch (error) {
        console.error("Error parsing user data:", error)
        router.push("/auth/login")
      }
    } else {
      router.push("/auth/login")
    }
  }, [router])

  const loadProducts = async (userId: number) => {
    try {
      const response = await fetch(`/api/products?supplierId=${userId}`)
      if (response.ok) {
        const data = await response.json()
        setProducts(data.products || [])
      }
    } catch (error) {
      console.error("Error loading products:", error)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("user")
    toast.success("Logged out successfully")
    router.push("/")
  }

  const onProductSubmit = async (data: ProductInput) => {
    try {
      const method = editingProduct ? "PUT" : "POST"
      const url = editingProduct ? `/api/products/${editingProduct.id}` : "/api/products"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...data, supplierId: user?.id }),
      })

      if (response.ok) {
        const result = await response.json()
        if (editingProduct) {
          setProducts(products.map((p) => (p.id === editingProduct.id ? result.product : p)))
          toast.success("Product updated successfully")
        } else {
          setProducts([result.product, ...products])
          toast.success("Product added successfully")
        }
        setIsProductDialogOpen(false)
        setEditingProduct(null)
        productForm.reset()
      } else {
        const error = await response.json()
        toast.error(error.error || "Failed to save product")
      }
    } catch (error) {
      console.error("Error saving product:", error)
      toast.error("An error occurred while saving the product")
    }
  }

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product)
    productForm.reset({
      name: product.name,
      description: product.description,
      category: product.category,
      price: product.price,
      leadTime: product.leadTime,
      minOrderQuantity: product.minOrderQuantity,
    })
    setIsProductDialogOpen(true)
  }

  const handleDeleteProduct = async (productId: number) => {
    if (!confirm("Are you sure you want to delete this product?")) return

    try {
      const response = await fetch(`/api/products/${productId}`, {
        method: "DELETE",
      })

      if (response.ok) {
        setProducts(products.filter((p) => p.id !== productId))
        toast.success("Product deleted successfully")
      } else {
        toast.error("Failed to delete product")
      }
    } catch (error) {
      console.error("Error deleting product:", error)
      toast.error("An error occurred while deleting the product")
    }
  }

  const handleViewInquiry = (inquiry: Inquiry) => {
    setSelectedInquiry(inquiry)
    setIsInquiryDialogOpen(true)
  }

  const handleRespondToInquiry = (inquiry: Inquiry) => {
    setSelectedInquiry(inquiry)
    responseForm.reset()
    setIsResponseDialogOpen(true)
  }

  const onResponseSubmit = async (data: InquiryResponseInput) => {
    if (!selectedInquiry) return

    try {
      const response = await fetch(`/api/inquiries/${selectedInquiry.id}/respond`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })

      if (response.ok) {
        const result = await response.json()
        setInquiries(
          inquiries.map((i) =>
            i.id === selectedInquiry.id
              ? {
                  ...i,
                  status: "responded",
                  response: data.message,
                  quotedPrice: data.quotedPrice,
                  deliveryTime: data.deliveryTime,
                  notes: data.notes,
                }
              : i,
          ),
        )
        toast.success("Response sent successfully")
        setIsResponseDialogOpen(false)
        setSelectedInquiry(null)
        responseForm.reset()
      } else {
        const error = await response.json()
        toast.error(error.error || "Failed to send response")
      }
    } catch (error) {
      console.error("Error sending response:", error)
      toast.error("An error occurred while sending the response")
    }
  }

  if (!user) {
    return <div>Loading...</div>
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200"
      case "responded":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
      case "closed":
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200"
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Building2 className="h-8 w-8 text-blue-600 mr-3" />
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">Welcome back, {user.name}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant={user.userType === "manufacturer" ? "default" : "secondary"}>{user.userType}</Badge>
              <ThemeToggle />
              <Button variant="ghost" size="sm" onClick={handleLogout}>
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Message */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Welcome back, {user.name}!</h2>
          <p className="text-gray-600 dark:text-gray-300">
            {user.userType === "manufacturer"
              ? "Manage your sourcing activities and connect with suppliers."
              : "Manage your product catalog and respond to manufacturer inquiries."}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {user.userType === "manufacturer" ? "Active Suppliers" : "Products"}
              </CardTitle>
              <Package className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{user.userType === "manufacturer" ? "12" : products.length}</div>
              <p className="text-xs text-muted-foreground">
                {user.userType === "manufacturer" ? "+2 from last month" : "in your catalog"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {user.userType === "manufacturer" ? "Pending Orders" : "Inquiries"}
              </CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {user.userType === "manufacturer" ? "8" : inquiries.filter((i) => i.status === "pending").length}
              </div>
              <p className="text-xs text-muted-foreground">
                {user.userType === "manufacturer" ? "awaiting delivery" : "need response"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">This Month</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{user.userType === "manufacturer" ? "R 125K" : "R 89K"}</div>
              <p className="text-xs text-muted-foreground">
                {user.userType === "manufacturer" ? "total spent" : "revenue generated"}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rating</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4.8</div>
              <p className="text-xs text-muted-foreground">
                based on {user.userType === "manufacturer" ? "24" : "156"} reviews
              </p>
            </CardContent>
          </Card>
        </div>

         {/* Orders Chart */}
{/*       <div className="bg-white dark:bg-background rounded-xl p-4 mb-5 shadow">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-medium">Orders This Month</h2>
          <Badge variant="secondary">July</Badge>
        </div>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={chartData}>
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Bar dataKey="Orders" fill="#4f46e5" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div> */}

        {/* Main Content */}
        {user.userType === "supplier" ? (
          <Tabs defaultValue="products" className="space-y-6">
            <TabsList>
              <TabsTrigger value="products">Product Catalog</TabsTrigger>
              <TabsTrigger value="inquiries">Manufacturer Inquiries</TabsTrigger>
              <TabsTrigger value="Orders">Supplier Orders</TabsTrigger> 
              <TabsTrigger value="mainDashboard">Main Dashboard</TabsTrigger>            
            </TabsList>

            <TabsContent value="products" className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Product Catalog</h3>
                <Dialog open={isProductDialogOpen} onOpenChange={setIsProductDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      onClick={() => {
                        setEditingProduct(null)
                        productForm.reset()
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Product
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[600px]">
                    <DialogHeader>
                      <DialogTitle>{editingProduct ? "Edit Product" : "Add New Product"}</DialogTitle>
                      <DialogDescription>
                        {editingProduct
                          ? "Update your product information below."
                          : "Add a new product to your catalog."}
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={productForm.handleSubmit(onProductSubmit)} className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormInput
                          label="Product Name"
                          placeholder="Enter product name"
                          error={productForm.formState.errors.name?.message}
                          {...productForm.register("name")}
                        />
                        <div className="space-y-2">
                          <label className="text-sm font-medium">Category</label>
                          <Select
                            onValueChange={(value) => productForm.setValue("category", value)}
                            defaultValue={editingProduct?.category}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select category" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="raw-materials">Raw Materials</SelectItem>
                              <SelectItem value="electronics">Electronics</SelectItem>
                              <SelectItem value="tools-equipment">Tools & Equipment</SelectItem>
                              <SelectItem value="chemicals">Chemicals</SelectItem>
                              <SelectItem value="packaging">Packaging</SelectItem>
                              <SelectItem value="textiles">Textiles</SelectItem>
                            </SelectContent>
                          </Select>
                          {productForm.formState.errors.category && (
                            <p className="text-sm text-red-500">{productForm.formState.errors.category.message}</p>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <label className="text-sm font-medium">Description</label>
                        <Textarea placeholder="Describe your product..." {...productForm.register("description")} />
                        {productForm.formState.errors.description && (
                          <p className="text-sm text-red-500">{productForm.formState.errors.description.message}</p>
                        )}
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <FormInput
                          label="Price (ZAR)"
                          placeholder="e.g., R 1,500"
                          error={productForm.formState.errors.price?.message}
                          {...productForm.register("price")}
                        />
                        <FormInput
                          label="Lead Time"
                          placeholder="e.g., 2-3 weeks"
                          error={productForm.formState.errors.leadTime?.message}
                          {...productForm.register("leadTime")}
                        />
                        <FormInput
                          label="Min Order Qty"
                          placeholder="e.g., 100 units"
                          error={productForm.formState.errors.minOrderQuantity?.message}
                          {...productForm.register("minOrderQuantity")}
                        />
                      </div>

                      <div className="flex justify-end space-x-2 pt-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => {
                            setIsProductDialogOpen(false)
                            setEditingProduct(null)
                            productForm.reset()
                          }}
                        >
                          Cancel
                        </Button>
                        <Button type="submit">{editingProduct ? "Update Product" : "Add Product"}</Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <Card key={product.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{product.name}</CardTitle>
                          <Badge variant="outline" className="mt-1">
                            {product.category}
                          </Badge>
                        </div>
                        <div className="flex space-x-1">
                          <Button size="sm" variant="ghost" onClick={() => handleEditProduct(product)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button size="sm" variant="ghost" onClick={() => handleDeleteProduct(product.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="mb-4">{product.description}</CardDescription>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Price:</span>
                          <span className="font-medium">{product.price}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Lead Time:</span>
                          <span>{product.leadTime}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-muted-foreground">Min Order:</span>
                          <span>{product.minOrderQuantity}</span>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {products.length === 0 && (
                  <div className="col-span-full text-center py-12">
                    <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No products yet</h3>
                    <p className="text-gray-600 dark:text-gray-300 mb-4">
                      Start building your product catalog to attract manufacturers.
                    </p>
                    <Button onClick={() => setIsProductDialogOpen(true)}>
                      <Plus className="h-4 w-4 mr-2" />
                      Add Your First Product
                    </Button>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="inquiries" className="space-y-6">
              <h3 className="text-lg font-semibold">Manufacturer Inquiries</h3>

              <div className="space-y-4">
                {inquiries.map((inquiry) => (
                  <Card key={inquiry.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{inquiry.subject}</CardTitle>
                          <CardDescription>
                            From: {inquiry.manufacturerName} ({inquiry.manufacturerEmail})
                          </CardDescription>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getPriorityColor(inquiry.priority)}>{inquiry.priority}</Badge>
                          <Badge className={getStatusColor(inquiry.status)}>{inquiry.status}</Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4 line-clamp-2">{inquiry.message}</p>

                      {inquiry.status === "responded" && inquiry.response && (
                        <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg mb-4">
                          <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">Your Response:</h4>
                          <p className="text-blue-800 dark:text-blue-200 text-sm">{inquiry.response}</p>
                          {inquiry.quotedPrice && (
                            <p className="text-blue-800 dark:text-blue-200 text-sm mt-2">
                              <strong>Quoted Price:</strong> {inquiry.quotedPrice}
                            </p>
                          )}
                        </div>
                      )}

                      <div className="flex justify-between items-center">
                        <span className="text-sm text-muted-foreground">
                          Received: {new Date(inquiry.createdAt).toLocaleDateString()}
                        </span>
                        <div className="flex space-x-2">
                          <Button size="sm" variant="outline" onClick={() => handleViewInquiry(inquiry)}>
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                          {inquiry.status === "pending" && (
                            <Button size="sm" onClick={() => handleRespondToInquiry(inquiry)}>
                              <Reply className="h-4 w-4 mr-2" />
                              Respond 
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}

                {inquiries.length === 0 && (
                  <div className="text-center py-12">
                    <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No inquiries yet</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Manufacturers will send inquiries about your products here.
                    </p>
                  </div>
                )}
              </div>
            </TabsContent>

            <TabsContent value="Orders" className="space-y-9">
              <h3>Supplier Orders </h3>
              <div className="text-center py-12">
                <CreateOrderForm supplierId={supplierId}/>
                
              </div><Orders supplierId={13} />
            </TabsContent>

            <TabsContent value="mainDashboard" className="space-y-6">
                <SupplierDashboard />
            </TabsContent>
          </Tabs>
        ) : (
          // Manufacturer Dashboard
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Your latest sourcing activities and supplier interactions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center space-x-4 p-4 border rounded-lg">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="font-medium">Quote received from SteelCorp Manufacturing</p>
                      <p className="text-sm text-muted-foreground">2 hours ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 p-4 border rounded-lg">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="font-medium">New supplier match found for Electronics category</p>
                      <p className="text-sm text-muted-foreground">1 day ago</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 p-4 border rounded-lg">
                    <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                    <div className="flex-1">
                      <p className="font-medium">Order delivered from Precision Tools Ltd</p>
                      <p className="text-sm text-muted-foreground">3 days ago</p>
                    </div>
                  </div>
                  {/* <insetBar /> */}
                </div>
              </CardContent>
            </Card>
            
              <CardHeader>
                <CardTitle>Supplier Ratings</CardTitle>
                <CardDescription>Recent ratings and reviews from manufacturers</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Supplier</TableHead>
                      <TableHead>Rating</TableHead>
                      <TableHead>Review</TableHead>
                      <TableHead>Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    <TableRow>
                      <TableCell>SteelCorp Manufacturing</TableCell>
                      <TableCell className="text-yellow-500">4.5 ★</TableCell>
                      <TableCell>Great quality steel sheets, fast delivery!</TableCell>
                      <TableCell>2024-01-10</TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell>Precision Tools Ltd</TableCell>
                      <TableCell className="text-yellow-500">4.8 ★</TableCell>
                      <TableCell>Excellent service and product quality.</TableCell>
                      <TableCell>2024-01-08</TableCell>
                    </TableRow>
                  </TableBody>
                </Table>

                {inquiries.length === 0 && (
                  <div className="text-center py-12">
                    <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No inquiries yet</h3>
                    <p className="text-gray-600 dark:text-gray-300">
                      Suppliers will send inquiries about your products here.
                    </p>
                  </div>
                )}
              </CardContent>
        {/* View Inquiry Dialog */}
        
        <Dialog open={isInquiryDialogOpen} onOpenChange={setIsInquiryDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Inquiry Details</DialogTitle>
              <DialogDescription>Complete information about this manufacturer inquiry</DialogDescription>
            </DialogHeader>
            {selectedInquiry && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">From</label>
                    <p className="font-medium">{selectedInquiry.manufacturerName}</p>
                    <p className="text-sm text-muted-foreground">{selectedInquiry.manufacturerEmail}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Priority</label>
                    <div className="mt-1">
                      <Badge className={getPriorityColor(selectedInquiry.priority)}>{selectedInquiry.priority}</Badge>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">Subject</label>
                  <p className="font-medium">{selectedInquiry.subject}</p>
                </div>

                <div>
                  <label className="text-sm font-medium text-muted-foreground">Message</label>
                  <p className="mt-1 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">{selectedInquiry.message}</p>
                </div>

                {selectedInquiry.response && (
                  <div>
                    <label className="text-sm font-medium text-muted-foreground">Your Response</label>
                    <div className="mt-1 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <p>{selectedInquiry.response}</p>
                      {selectedInquiry.quotedPrice && (
                        <p className="mt-2">
                          <strong>Quoted Price:</strong> {selectedInquiry.quotedPrice}
                        </p>
                      )}
                      {selectedInquiry.deliveryTime && (
                        <p>
                          <strong>Delivery Time:</strong> {selectedInquiry.deliveryTime}
                        </p>
                      )}
                      {selectedInquiry.notes && (
                        <p>
                          <strong>Notes:</strong> {selectedInquiry.notes}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                <div className="text-sm text-muted-foreground">
                  Received: {new Date(selectedInquiry.createdAt).toLocaleString()}
                  {selectedInquiry.respondedAt && (
                    <span> • Responded: {new Date(selectedInquiry.respondedAt).toLocaleString()}</span>
                  )}
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>

          </div>
        )}



        {/* Response Dialog */}
        <Dialog open={isResponseDialogOpen} onOpenChange={setIsResponseDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>Respond to Inquiry</DialogTitle>
              <DialogDescription>Send your response to {selectedInquiry?.manufacturerName}</DialogDescription>
            </DialogHeader>
            <form onSubmit={responseForm.handleSubmit(onResponseSubmit)} className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Response Message *</label>
                <Textarea
                  placeholder="Write your response to the manufacturer..."
                  {...responseForm.register("message")}
                />
                {responseForm.formState.errors.message && (
                  <p className="text-sm text-red-500">{responseForm.formState.errors.message.message}</p>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                  label="Quoted Price (Optional)"
                  placeholder="e.g., R 25,000"
                  error={responseForm.formState.errors.quotedPrice?.message}
                  {...responseForm.register("quotedPrice")}
                />
                <FormInput
                  label="Delivery Time (Optional)"
                  placeholder="e.g., 2-3 weeks"
                  error={responseForm.formState.errors.deliveryTime?.message}
                  {...responseForm.register("deliveryTime")}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Additional Notes (Optional)</label>
                <Textarea placeholder="Any additional information or terms..." {...responseForm.register("notes")} />
              </div>

              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsResponseDialogOpen(false)
                    setSelectedInquiry(null)
                    responseForm.reset()
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">Send Response</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>
     

      

     
    </div>
  )
}

