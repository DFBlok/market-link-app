"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Clock, User, Video, FileText, Download, Star, MapPin, CheckCircle, Users } from "lucide-react"
import { format } from "date-fns"

export default function ResourceCenter() {
  const [selectedDate, setSelectedDate] = useState<Date>()
  const [bookingForm, setBookingForm] = useState({
    name: "",
    email: "",
    phone: "",
    businessType: "",
    sessionType: "",
    preferredTime: "",
    message: "",
  })
  const [bookingStatus, setBookingStatus] = useState<"idle" | "loading" | "success" | "error">("idle")

  const mentors = [
    {
      id: 1,
      name: "Thabo Mthembu",
      expertise: "Business Registration & Compliance",
      experience: "15 years",
      rating: 4.9,
      location: "Johannesburg",
      languages: ["English", "isiZulu", "Afrikaans"],
      image: "/placeholder-user.jpg",
      bio: "Former CIPC consultant with extensive experience in business registration and compliance.",
    },
    {
      id: 2,
      name: "Sarah van der Merwe",
      expertise: "Financial Planning & Tax",
      experience: "12 years",
      rating: 4.8,
      location: "Cape Town",
      languages: ["English", "Afrikaans"],
      image: "/placeholder-user.jpg",
      bio: "Chartered Accountant specializing in SMME financial planning and tax optimization.",
    },
    {
      id: 3,
      name: "Nomsa Dlamini",
      expertise: "Marketing & Digital Growth",
      experience: "8 years",
      rating: 4.9,
      location: "Durban",
      languages: ["English", "isiZulu", "isiXhosa"],
      image: "/placeholder-user.jpg",
      bio: "Digital marketing expert helping SMMEs build their online presence and grow their customer base.",
    },
  ]

  const resources = [
    {
      title: "Complete Business Registration Guide",
      type: "PDF Guide",
      description: "Step-by-step guide to registering your business in South Africa",
      downloadUrl: "#",
      category: "Registration",
    },
    {
      title: "Tax Planning Spreadsheet",
      type: "Excel Template",
      description: "Calculate your tax obligations and plan your finances",
      downloadUrl: "#",
      category: "Finance",
    },
    {
      title: "Marketing Plan Template",
      type: "Word Document",
      description: "Create a comprehensive marketing strategy for your business",
      downloadUrl: "#",
      category: "Marketing",
    },
    {
      title: "Employment Contract Template",
      type: "PDF Template",
      description: "Legal employment contract template compliant with SA labor law",
      downloadUrl: "#",
      category: "Legal",
    },
  ]

  const webinars = [
    {
      title: "Starting Your Business in 2024",
      date: "2024-02-15",
      time: "14:00",
      duration: "60 minutes",
      presenter: "Thabo Mthembu",
      status: "upcoming",
    },
    {
      title: "Digital Marketing for SMMEs",
      date: "2024-02-22",
      time: "10:00",
      duration: "90 minutes",
      presenter: "Nomsa Dlamini",
      status: "upcoming",
    },
    {
      title: "Tax Planning Strategies",
      date: "2024-01-25",
      time: "15:00",
      duration: "75 minutes",
      presenter: "Sarah van der Merwe",
      status: "recorded",
    },
  ]

  const handleBookingSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setBookingStatus("loading")

    try {
      const response = await fetch("/api/mentoring/book", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...bookingForm,
          selectedDate: selectedDate?.toISOString(),
        }),
      })

      if (response.ok) {
        setBookingStatus("success")
        setBookingForm({
          name: "",
          email: "",
          phone: "",
          businessType: "",
          sessionType: "",
          preferredTime: "",
          message: "",
        })
        setSelectedDate(undefined)
      } else {
        setBookingStatus("error")
      }
    } catch (error) {
      setBookingStatus("error")
    }
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Resource Center</h2>
        <p className="text-gray-600">Access expert guidance, templates, and learning resources</p>
      </div>

      <Tabs defaultValue="mentoring" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="mentoring">Mentoring</TabsTrigger>
          <TabsTrigger value="resources">Resources</TabsTrigger>
          <TabsTrigger value="webinars">Webinars</TabsTrigger>
          <TabsTrigger value="community">Community</TabsTrigger>
        </TabsList>

        <TabsContent value="mentoring">
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Expert Mentoring</h3>
              <p className="text-gray-600">Get personalized guidance from experienced business mentors</p>
            </div>

            {/* Mentors Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {mentors.map((mentor) => (
                <Card key={mentor.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="text-center">
                    <div className="w-20 h-20 rounded-full bg-gray-200 mx-auto mb-4 flex items-center justify-center">
                      <User className="h-10 w-10 text-gray-400" />
                    </div>
                    <CardTitle className="text-lg">{mentor.name}</CardTitle>
                    <p className="text-sm text-gray-600">{mentor.expertise}</p>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span>Experience:</span>
                      <Badge variant="secondary">{mentor.experience}</Badge>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span>Rating:</span>
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span>{mentor.rating}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="h-4 w-4 text-gray-400" />
                      <span>{mentor.location}</span>
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">Languages: </span>
                      {mentor.languages.join(", ")}
                    </div>
                    <p className="text-xs text-gray-600">{mentor.bio}</p>
                    <Button className="w-full" size="sm">
                      Book Session
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Booking Form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CalendarIcon className="h-5 w-5 text-blue-600" />
                  Book a Mentoring Session
                </CardTitle>
              </CardHeader>
              <CardContent>
                {bookingStatus === "success" ? (
                  <div className="text-center py-8">
                    <CheckCircle className="h-12 w-12 text-green-600 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-green-800 mb-2">Booking Confirmed!</h3>
                    <p className="text-gray-600">We'll contact you within 24 hours to confirm your session details.</p>
                  </div>
                ) : (
                  <form onSubmit={handleBookingSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Full Name</Label>
                        <Input
                          id="name"
                          value={bookingForm.name}
                          onChange={(e) => setBookingForm((prev) => ({ ...prev, name: e.target.value }))}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                          id="email"
                          type="email"
                          value={bookingForm.email}
                          onChange={(e) => setBookingForm((prev) => ({ ...prev, email: e.target.value }))}
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          value={bookingForm.phone}
                          onChange={(e) => setBookingForm((prev) => ({ ...prev, phone: e.target.value }))}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="businessType">Business Type</Label>
                        <Select onValueChange={(value) => setBookingForm((prev) => ({ ...prev, businessType: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select business type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="startup">Startup</SelectItem>
                            <SelectItem value="existing">Existing Business</SelectItem>
                            <SelectItem value="idea">Business Idea</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="sessionType">Session Type</Label>
                        <Select onValueChange={(value) => setBookingForm((prev) => ({ ...prev, sessionType: value }))}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select session type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="registration">Business Registration</SelectItem>
                            <SelectItem value="financial">Financial Planning</SelectItem>
                            <SelectItem value="marketing">Marketing Strategy</SelectItem>
                            <SelectItem value="legal">Legal Compliance</SelectItem>
                            <SelectItem value="general">General Business Advice</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="preferredTime">Preferred Time</Label>
                        <Select
                          onValueChange={(value) => setBookingForm((prev) => ({ ...prev, preferredTime: value }))}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select preferred time" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="morning">Morning (9:00 - 12:00)</SelectItem>
                            <SelectItem value="afternoon">Afternoon (12:00 - 17:00)</SelectItem>
                            <SelectItem value="evening">Evening (17:00 - 20:00)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="date">Preferred Date</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            className="w-full justify-start text-left font-normal bg-transparent"
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {selectedDate ? format(selectedDate, "PPP") : "Pick a date"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} initialFocus />
                        </PopoverContent>
                      </Popover>
                    </div>

                    <div>
                      <Label htmlFor="message">Additional Information</Label>
                      <Textarea
                        id="message"
                        placeholder="Tell us about your business and what you'd like to discuss..."
                        value={bookingForm.message}
                        onChange={(e) => setBookingForm((prev) => ({ ...prev, message: e.target.value }))}
                      />
                    </div>

                    <Button type="submit" className="w-full" disabled={bookingStatus === "loading"}>
                      {bookingStatus === "loading" ? "Booking..." : "Book Session"}
                    </Button>

                    {bookingStatus === "error" && (
                      <div className="text-center text-red-600 text-sm">
                        There was an error booking your session. Please try again.
                      </div>
                    )}
                  </form>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="resources">
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Business Resources</h3>
              <p className="text-gray-600">Download templates, guides, and tools to help your business succeed</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {resources.map((resource, index) => (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5 text-blue-600" />
                      {resource.title}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{resource.type}</Badge>
                      <Badge variant="secondary">{resource.category}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-sm text-gray-600">{resource.description}</p>
                    <Button className="w-full bg-transparent" variant="outline">
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="bg-green-50 border-green-200">
              <CardContent className="p-4">
                <h4 className="font-semibold text-green-800 mb-2">📚 Resource Categories</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <h5 className="font-medium text-green-700 mb-1">Legal & Compliance:</h5>
                    <ul className="text-green-600 space-y-1">
                      <li>• Business registration forms</li>
                      <li>• Contract templates</li>
                      <li>• Compliance checklists</li>
                      <li>• Legal requirement guides</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-medium text-green-700 mb-1">Financial Planning:</h5>
                    <ul className="text-green-600 space-y-1">
                      <li>• Business plan templates</li>
                      <li>• Financial projection tools</li>
                      <li>• Tax calculation sheets</li>
                      <li>• Funding application guides</li>
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="webinars">
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Educational Webinars</h3>
              <p className="text-gray-600">Join live sessions or watch recorded webinars from business experts</p>
            </div>

            <div className="space-y-4">
              {webinars.map((webinar, index) => (
                <Card key={index}>
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800 mb-2">{webinar.title}</h4>
                        <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                          <div className="flex items-center gap-1">
                            <CalendarIcon className="h-4 w-4" />
                            {format(new Date(webinar.date), "PPP")}
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {webinar.time} ({webinar.duration})
                          </div>
                          <div className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            {webinar.presenter}
                          </div>
                        </div>
                        <Badge variant={webinar.status === "upcoming" ? "default" : "secondary"} className="mb-2">
                          {webinar.status === "upcoming" ? "Upcoming" : "Recorded"}
                        </Badge>
                      </div>
                      <Button variant={webinar.status === "upcoming" ? "default" : "outline"} size="sm">
                        <Video className="h-4 w-4 mr-2" />
                        {webinar.status === "upcoming" ? "Register" : "Watch"}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <Card className="bg-blue-50 border-blue-200">
              <CardContent className="p-4">
                <h4 className="font-semibold text-blue-800 mb-2">🎓 Upcoming Topics</h4>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Export opportunities for South African businesses</li>
                  <li>• Digital transformation for traditional businesses</li>
                  <li>• Sustainable business practices and green funding</li>
                  <li>• Building resilient supply chains</li>
                  <li>• Employee wellness and productivity</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="community">
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Business Community</h3>
              <p className="text-gray-600">Connect with other entrepreneurs and share experiences</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-purple-600" />
                    Discussion Forums
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">General Business</span>
                      <Badge variant="secondary">234 posts</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Funding & Investment</span>
                      <Badge variant="secondary">89 posts</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Marketing & Sales</span>
                      <Badge variant="secondary">156 posts</Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">Technology & Innovation</span>
                      <Badge variant="secondary">67 posts</Badge>
                    </div>
                  </div>
                  <Button className="w-full bg-transparent" variant="outline">
                    Join Discussions
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MapPin className="h-5 w-5 text-green-600" />
                    Local Meetups
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <div className="border-l-4 border-green-500 pl-3">
                      <h5 className="font-medium text-sm">Cape Town Entrepreneurs</h5>
                      <p className="text-xs text-gray-600">Next: Feb 20, 18:00</p>
                    </div>
                    <div className="border-l-4 border-blue-500 pl-3">
                      <h5 className="font-medium text-sm">Joburg Business Network</h5>
                      <p className="text-xs text-gray-600">Next: Feb 25, 17:30</p>
                    </div>
                    <div className="border-l-4 border-purple-500 pl-3">
                      <h5 className="font-medium text-sm">Durban Startup Hub</h5>
                      <p className="text-xs text-gray-600">Next: Mar 1, 19:00</p>
                    </div>
                  </div>
                  <Button className="w-full bg-transparent" variant="outline">
                    Find Meetups
                  </Button>
                </CardContent>
              </Card>
            </div>

            <Card className="bg-orange-50 border-orange-200">
              <CardContent className="p-4">
                <h4 className="font-semibold text-orange-800 mb-2">🤝 Community Guidelines</h4>
                <ul className="text-sm text-orange-700 space-y-1">
                  <li>• Be respectful and supportive of fellow entrepreneurs</li>
                  <li>• Share knowledge and experiences openly</li>
                  <li>• No spam or excessive self-promotion</li>
                  <li>• Keep discussions relevant to business topics</li>
                  <li>• Report inappropriate content to moderators</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
