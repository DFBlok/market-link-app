"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Target, TrendingUp, Mail, MessageSquare, Share2, BarChart3, Lightbulb, Copy, Download } from "lucide-react"

export default function MarketingTools() {
  const [businessName, setBusinessName] = useState("")
  const [targetAudience, setTargetAudience] = useState("")
  const [budget, setBudget] = useState("")
  const [generatedContent, setGeneratedContent] = useState("")

  const marketingChannels = [
    {
      name: "Social Media",
      description: "Facebook, Instagram, Twitter, LinkedIn",
      cost: "R500 - R5,000/month",
      reach: "High",
      difficulty: "Medium",
      icon: Share2,
      color: "bg-blue-100 text-blue-800",
    },
    {
      name: "Google Ads",
      description: "Search and display advertising",
      cost: "R1,000 - R10,000/month",
      reach: "Very High",
      difficulty: "High",
      icon: Target,
      color: "bg-green-100 text-green-800",
    },
    {
      name: "Email Marketing",
      description: "Newsletter and promotional emails",
      cost: "R200 - R2,000/month",
      reach: "Medium",
      difficulty: "Low",
      icon: Mail,
      color: "bg-purple-100 text-purple-800",
    },
    {
      name: "Content Marketing",
      description: "Blog posts, videos, podcasts",
      cost: "R500 - R3,000/month",
      reach: "Medium",
      difficulty: "Medium",
      icon: MessageSquare,
      color: "bg-orange-100 text-orange-800",
    },
  ]

  const socialMediaTemplates = [
    {
      platform: "Facebook",
      type: "Product Launch",
      template:
        "🎉 Exciting news! We're thrilled to introduce [PRODUCT NAME] - designed specifically for [TARGET AUDIENCE]. \n\n✨ Key benefits:\n• [Benefit 1]\n• [Benefit 2]\n• [Benefit 3]\n\n🛒 Get yours today: [LINK]\n\n#SouthAfricanBusiness #NewProduct #[YourHashtag]",
    },
    {
      platform: "Instagram",
      type: "Behind the Scenes",
      template:
        "Behind the scenes at [BUSINESS NAME] 👀\n\nThis is how we [PROCESS/ACTIVITY] to bring you the best [PRODUCT/SERVICE]. \n\nSwipe to see our team in action! ➡️\n\n#BehindTheScenes #SouthAfricanMade #TeamWork #[YourHashtag]",
    },
    {
      platform: "LinkedIn",
      type: "Business Update",
      template:
        "Exciting milestone for [BUSINESS NAME]! 🚀\n\nWe're proud to announce [ACHIEVEMENT/UPDATE]. This wouldn't have been possible without our amazing team and loyal customers.\n\n[BRIEF STORY OR CONTEXT]\n\nThank you for being part of our journey. Here's to continued growth and success!\n\n#BusinessGrowth #SouthAfricanEntrepreneur #Milestone",
    },
  ]

  const generateContent = () => {
    if (!businessName || !targetAudience) {
      setGeneratedContent("Please fill in your business name and target audience first.")
      return
    }

    const templates = [
      `🌟 At ${businessName}, we understand what ${targetAudience} need most. That's why we've dedicated ourselves to providing exceptional solutions that make a real difference in your life. #SouthAfricanBusiness #CustomerFirst`,

      `💡 Did you know? ${businessName} was founded with one simple mission: to serve ${targetAudience} with integrity and excellence. Every day, we work hard to earn your trust. #LocalBusiness #SouthAfrica`,

      `🎯 Attention ${targetAudience}! ${businessName} has something special just for you. Our team has been working tirelessly to bring you the best products and services. Stay tuned for exciting updates! #ComingSoon #MadeInSA`,
    ]

    const randomTemplate = templates[Math.floor(Math.random() * templates.length)]
    setGeneratedContent(randomTemplate)
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Marketing Tools</h2>
        <p className="text-gray-600">Grow your business with smart marketing strategies and tools</p>
      </div>

      <Tabs defaultValue="channels" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="channels">Channels</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="channels">
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Marketing Channels</h3>
              <p className="text-gray-600">Choose the right channels for your business and budget</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {marketingChannels.map((channel, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <channel.icon className="h-5 w-5 text-blue-600" />
                      {channel.name}
                    </CardTitle>
                    <p className="text-sm text-gray-600">{channel.description}</p>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Monthly Cost:</span>
                      <Badge variant="outline">{channel.cost}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Reach Potential:</span>
                      <Badge className={channel.color}>{channel.reach}</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Difficulty:</span>
                      <Badge variant="secondary">{channel.difficulty}</Badge>
                    </div>
                    <Button className="w-full mt-4 bg-transparent" variant="outline">
                      Learn More
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="bg-yellow-50 border-yellow-200">
              <CardContent className="p-4">
                <h4 className="font-semibold text-yellow-800 mb-2">💡 Marketing Tips for SMMEs</h4>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• Start with one channel and master it before expanding</li>
                  <li>• Focus on your local community first</li>
                  <li>• Use authentic South African content and language</li>
                  <li>• Collaborate with other local businesses</li>
                  <li>• Track your results and adjust your strategy</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="content">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-yellow-600" />
                  Content Generator
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="businessName">Business Name</Label>
                    <Input
                      id="businessName"
                      placeholder="e.g., Mzansi Crafts"
                      value={businessName}
                      onChange={(e) => setBusinessName(e.target.value)}
                    />
                  </div>
                  <div>
                    <Label htmlFor="targetAudience">Target Audience</Label>
                    <Input
                      id="targetAudience"
                      placeholder="e.g., young professionals"
                      value={targetAudience}
                      onChange={(e) => setTargetAudience(e.target.value)}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="budget">Monthly Marketing Budget (R)</Label>
                  <Input
                    id="budget"
                    type="number"
                    placeholder="e.g., 2000"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                  />
                </div>
                <Button onClick={generateContent} className="w-full">
                  Generate Content Ideas
                </Button>

                {generatedContent && (
                  <div className="mt-4">
                    <Label>Generated Content:</Label>
                    <div className="relative">
                      <Textarea value={generatedContent} readOnly className="mt-2 min-h-[100px]" />
                      <Button
                        size="sm"
                        variant="outline"
                        className="absolute top-2 right-2 bg-transparent"
                        onClick={() => copyToClipboard(generatedContent)}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-4">
                <h4 className="font-semibold text-green-800 mb-2">📝 Content Ideas for South African Businesses</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h5 className="font-medium text-green-700 mb-1">Local Focus:</h5>
                    <ul className="text-green-600 space-y-1">
                      <li>• Heritage Day celebrations</li>
                      <li>• Local community involvement</li>
                      <li>• Supporting local suppliers</li>
                      <li>• South African success stories</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-medium text-green-700 mb-1">Engagement:</h5>
                    <ul className="text-green-600 space-y-1">
                      <li>• Behind-the-scenes content</li>
                      <li>• Customer testimonials</li>
                      <li>• Educational posts</li>
                      <li>• Interactive polls and Q&As</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="templates">
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Social Media Templates</h3>
              <p className="text-gray-600">Ready-to-use templates for your social media posts</p>
            </div>

            <div className="space-y-4">
              {socialMediaTemplates.map((template, index) => (
                <Card key={index}>
                  <CardHeader>
                    <CardTitle className="flex items-center justify-between">
                      <span className="flex items-center gap-2">
                        <Share2 className="h-5 w-5 text-blue-600" />
                        {template.platform} - {template.type}
                      </span>
                      <Button size="sm" variant="outline" onClick={() => copyToClipboard(template.template)}>
                        <Copy className="h-4 w-4 mr-2" />
                        Copy
                      </Button>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <pre className="text-sm whitespace-pre-wrap font-sans">{template.template}</pre>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <h4 className="font-semibold text-blue-800 mb-2">📱 Template Usage Tips</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Replace [PLACEHOLDERS] with your specific information</li>
                  <li>• Add relevant hashtags for your industry and location</li>
                  <li>• Include high-quality images or videos</li>
                  <li>• Post consistently at optimal times for your audience</li>
                  <li>• Engage with comments and messages promptly</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Marketing Analytics</h3>
              <p className="text-gray-600">Track your marketing performance and ROI</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="h-5 w-5 text-green-600" />
                    Key Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex justify-between">
                      <span>Website Visitors:</span>
                      <span className="font-semibold">1,234</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Social Followers:</span>
                      <span className="font-semibold">567</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Email Subscribers:</span>
                      <span className="font-semibold">89</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Conversion Rate:</span>
                      <span className="font-semibold">3.2%</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-blue-600" />
                    Growth
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex justify-between">
                      <span>This Month:</span>
                      <span className="font-semibold text-green-600">+15%</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Last Month:</span>
                      <span className="font-semibold text-green-600">+8%</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Quarter:</span>
                      <span className="font-semibold text-green-600">+32%</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Year:</span>
                      <span className="font-semibold text-green-600">+127%</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Target className="h-5 w-5 text-purple-600" />
                    ROI
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-sm">
                    <li className="flex justify-between">
                      <span>Ad Spend:</span>
                      <span className="font-semibold">R2,500</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Revenue:</span>
                      <span className="font-semibold">R8,750</span>
                    </li>
                    <li className="flex justify-between">
                      <span>ROI:</span>
                      <span className="font-semibold text-green-600">250%</span>
                    </li>
                    <li className="flex justify-between">
                      <span>Cost per Lead:</span>
                      <span className="font-semibold">R125</span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Analytics Tools</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Button variant="outline" className="justify-start bg-transparent">
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Google Analytics Setup
                  </Button>
                  <Button variant="outline" className="justify-start bg-transparent">
                    <Target className="h-4 w-4 mr-2" />
                    Facebook Pixel Setup
                  </Button>
                  <Button variant="outline" className="justify-start bg-transparent">
                    <TrendingUp className="h-4 w-4 mr-2" />
                    Performance Report
                  </Button>
                  <Button variant="outline" className="justify-start bg-transparent">
                    <Download className="h-4 w-4 mr-2" />
                    Export Data
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-purple-50 border-purple-200">
              <CardContent className="p-4">
                <h4 className="font-semibold text-purple-800 mb-2">📊 Analytics Best Practices</h4>
                <ul className="text-sm text-purple-700 space-y-1">
                  <li>• Set up conversion tracking from day one</li>
                  <li>• Monitor your most important KPIs weekly</li>
                  <li>• A/B test your marketing campaigns</li>
                  <li>• Use UTM parameters to track campaign performance</li>
                  <li>• Review and adjust your strategy monthly</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
