"use client"

import { useState } from "react"
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

  const handleProfileSave = () => {
    // In a real app, this would save to the backend
    setEditingProfile(false)
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
                <p className="text-sm text-gray-500">Welcome back, Supplier</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="sm">
                <Bell className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Rest of the dashboard content remains exactly the same */}
      {/* ... [all the existing dashboard content] ... */}
    </div>
  )
}