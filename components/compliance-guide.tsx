"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
  FileText,
  CheckCircle,
  AlertCircle,
  Download,
  ExternalLink,
  Building,
  Users,
  Shield,
  Calculator,
} from "lucide-react"

export default function ComplianceGuide() {
  const [businessName, setBusinessName] = useState("")
  const [businessType, setBusinessType] = useState("")
  const [completedSteps, setCompletedSteps] = useState<number[]>([])

  const registrationSteps = [
    {
      id: 1,
      title: "Choose Business Structure",
      description: "Decide between Sole Proprietorship, Partnership, Close Corporation, or Private Company",
      status: "pending",
      timeEstimate: "1 day",
    },
    {
      id: 2,
      title: "Reserve Company Name",
      description: "Check name availability and reserve it with CIPC",
      status: "pending",
      timeEstimate: "1-2 days",
    },
    {
      id: 3,
      title: "Prepare Documentation",
      description: "Gather ID copies, proof of address, and company documents",
      status: "pending",
      timeEstimate: "1 day",
    },
    {
      id: 4,
      title: "Submit CIPC Application",
      description: "Complete and submit your company registration",
      status: "pending",
      timeEstimate: "5-10 days",
    },
    {
      id: 5,
      title: "Register for Tax",
      description: "Register with SARS for income tax and VAT (if applicable)",
      status: "pending",
      timeEstimate: "3-5 days",
    },
    {
      id: 6,
      title: "Open Business Bank Account",
      description: "Open a dedicated business banking account",
      status: "pending",
      timeEstimate: "1-2 days",
    },
  ]

  const toggleStepCompletion = (stepId: number) => {
    setCompletedSteps((prev) => (prev.includes(stepId) ? prev.filter((id) => id !== stepId) : [...prev, stepId]))
  }

  const progressPercentage = (completedSteps.length / registrationSteps.length) * 100

  const businessStructures = [
    {
      type: "Sole Proprietorship",
      description: "Simplest form - you are the business",
      pros: ["Easy to start", "Full control", "Tax benefits"],
      cons: ["Unlimited liability", "Limited growth potential"],
      cost: "R0 - R500",
      icon: Users,
    },
    {
      type: "Private Company (Pty Ltd)",
      description: "Separate legal entity with limited liability",
      pros: ["Limited liability", "Professional image", "Growth potential"],
      cons: ["More paperwork", "Higher costs", "Compliance requirements"],
      cost: "R500 - R1,500",
      icon: Building,
    },
    {
      type: "Close Corporation (CC)",
      description: "Hybrid between sole proprietorship and company",
      pros: ["Limited liability", "Flexible management", "Lower costs than Pty Ltd"],
      cons: ["Limited to 10 members", "Less prestigious"],
      cost: "R200 - R800",
      icon: Shield,
    },
  ]

  const taxObligations = [
    {
      tax: "Income Tax",
      threshold: "All businesses",
      rate: "28% for companies",
      deadline: "7 months after year-end",
    },
    {
      tax: "VAT",
      threshold: "R1 million+ turnover",
      rate: "15%",
      deadline: "Monthly/Bi-monthly",
    },
    {
      tax: "PAYE",
      threshold: "If you have employees",
      rate: "Variable",
      deadline: "7th of following month",
    },
    {
      tax: "UIF",
      threshold: "If you have employees",
      rate: "2% of salary",
      deadline: "7th of following month",
    },
  ]

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Business Compliance Guide</h2>
        <p className="text-gray-600">
          Step-by-step guidance for registering and running your business legally in South Africa
        </p>
      </div>

      <Tabs defaultValue="registration" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="registration">Registration</TabsTrigger>
          <TabsTrigger value="structures">Business Types</TabsTrigger>
          <TabsTrigger value="tax">Tax Guide</TabsTrigger>
          <TabsTrigger value="documents">Documents</TabsTrigger>
        </TabsList>

        <TabsContent value="registration">
          <div className="space-y-6">
            {/* Progress Tracker */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-600" />
                  Registration Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium">Overall Progress</span>
                    <span className="text-sm text-gray-600">
                      {completedSteps.length} of {registrationSteps.length} completed
                    </span>
                  </div>
                  <Progress value={progressPercentage} className="w-full" />
                </div>
              </CardContent>
            </Card>

            {/* Registration Steps */}
            <div className="space-y-4">
              {registrationSteps.map((step) => (
                <Card
                  key={step.id}
                  className={`${completedSteps.includes(step.id) ? "bg-green-50 border-green-200" : ""}`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <button
                          onClick={() => toggleStepCompletion(step.id)}
                          className={`mt-1 rounded-full p-1 ${
                            completedSteps.includes(step.id) ? "bg-green-600 text-white" : "border-2 border-gray-300"
                          }`}
                        >
                          <CheckCircle className="h-4 w-4" />
                        </button>
                        <div>
                          <h3 className="font-semibold text-gray-800">{step.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">{step.description}</p>
                        </div>
                      </div>
                      <Badge variant="outline">{step.timeEstimate}</Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Quick Actions */}
            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <h3 className="font-semibold text-blue-800 mb-3">Quick Actions</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Button variant="outline" className="justify-start bg-transparent">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    CIPC Website
                  </Button>
                  <Button variant="outline" className="justify-start bg-transparent">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    SARS eFiling
                  </Button>
                  <Button variant="outline" className="justify-start bg-transparent">
                    <Download className="h-4 w-4 mr-2" />
                    Download Checklist
                  </Button>
                  <Button variant="outline" className="justify-start bg-transparent">
                    <Calculator className="h-4 w-4 mr-2" />
                    Cost Calculator
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="structures">
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Choose Your Business Structure</h3>
              <p className="text-gray-600">Each structure has different legal, tax, and operational implications</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {businessStructures.map((structure, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <structure.icon className="h-5 w-5 text-blue-600" />
                      {structure.type}
                    </CardTitle>
                    <p className="text-sm text-gray-600">{structure.description}</p>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-green-700 mb-2">Advantages:</h4>
                      <ul className="text-sm space-y-1">
                        {structure.pros.map((pro, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <CheckCircle className="h-3 w-3 text-green-600" />
                            {pro}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-semibold text-red-700 mb-2">Disadvantages:</h4>
                      <ul className="text-sm space-y-1">
                        {structure.cons.map((con, i) => (
                          <li key={i} className="flex items-center gap-2">
                            <AlertCircle className="h-3 w-3 text-red-600" />
                            {con}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="pt-2 border-t">
                      <p className="text-sm font-semibold">
                        Setup Cost: <span className="text-green-600">{structure.cost}</span>
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="bg-yellow-50 border-yellow-200">
              <CardContent className="p-4">
                <h4 className="font-semibold text-yellow-800 mb-2">💡 Need Help Choosing?</h4>
                <p className="text-sm text-yellow-700 mb-3">
                  Consider factors like liability protection, tax implications, growth plans, and compliance
                  requirements.
                </p>
                <Button size="sm" variant="outline">
                  Get Personalized Recommendation
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="tax">
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Tax Obligations</h3>
              <p className="text-gray-600">Understanding your tax responsibilities as a South African business</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {taxObligations.map((tax, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="text-lg">{tax.tax}</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <Label className="text-sm font-semibold text-gray-700">Threshold:</Label>
                      <p className="text-sm">{tax.threshold}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-semibold text-gray-700">Rate:</Label>
                      <p className="text-sm">{tax.rate}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-semibold text-gray-700">Deadline:</Label>
                      <p className="text-sm">{tax.deadline}</p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-4">
                <h4 className="font-semibold text-green-800 mb-2">📊 Tax Planning Tips</h4>
                <ul className="text-sm text-green-700 space-y-1">
                  <li>• Keep detailed records of all business expenses</li>
                  <li>• Consider hiring a qualified accountant</li>
                  <li>• Register for VAT voluntarily if it benefits your business</li>
                  <li>• Make provisional tax payments to avoid penalties</li>
                  <li>• Claim all legitimate business deductions</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="documents">
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Required Documents</h3>
              <p className="text-gray-600">Essential documents for business registration and compliance</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-blue-600" />
                    Registration Documents
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Certified copy of ID document
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Proof of residential address
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Company name reservation
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Memorandum of Incorporation
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Notice of Incorporation
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-green-600" />
                    Ongoing Compliance
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Annual Return (AR1)
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Financial statements
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      Tax returns
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      VAT returns (if applicable)
                    </li>
                    <li className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      PAYE submissions
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <h4 className="font-semibold text-blue-800 mb-3">📋 Document Templates</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <Button variant="outline" className="justify-start bg-transparent">
                    <Download className="h-4 w-4 mr-2" />
                    Memorandum Template
                  </Button>
                  <Button variant="outline" className="justify-start bg-transparent">
                    <Download className="h-4 w-4 mr-2" />
                    Shareholder Agreement
                  </Button>
                  <Button variant="outline" className="justify-start bg-transparent">
                    <Download className="h-4 w-4 mr-2" />
                    Employment Contract
                  </Button>
                  <Button variant="outline" className="justify-start bg-transparent">
                    <Download className="h-4 w-4 mr-2" />
                    Invoice Template
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
