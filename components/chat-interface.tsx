"use client"

import { useChat } from "@ai-sdk/react"
import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MessageSquare, Send, Bot, User, Lightbulb, Calculator, FileText, Megaphone, Globe } from "lucide-react"

export default function ChatInterface() {
  const { messages, input, handleInputChange, handleSubmit, isLoading } = useChat()
  const [selectedLanguage, setSelectedLanguage] = useState("English")

  const languages = ["English", "isiZulu", "isiXhosa", "Afrikaans"]

  const quickQuestions = [
    {
      question: "How do I register my business in South Africa?",
      category: "Registration",
      icon: FileText,
    },
    {
      question: "What are the tax implications for my business?",
      category: "Tax",
      icon: Calculator,
    },
    {
      question: "How can I market my business on a small budget?",
      category: "Marketing",
      icon: Megaphone,
    },
    {
      question: "What business structure should I choose?",
      category: "Legal",
      icon: FileText,
    },
  ]

  const handleQuickQuestion = (question: string) => {
    handleSubmit(new Event("submit") as any, { data: { message: question } })
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">AI Business Assistant</h2>
        <p className="text-gray-600">Get instant answers to your business questions in your preferred language</p>
      </div>

      {/* Language Selector */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-blue-600" />
            Choose Your Language
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {languages.map((lang) => (
              <Button
                key={lang}
                variant={selectedLanguage === lang ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedLanguage(lang)}
              >
                {lang}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Quick Questions */}
      {messages.length === 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="h-5 w-5 text-yellow-600" />
              Quick Questions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {quickQuestions.map((item, index) => (
                <Button
                  key={index}
                  variant="outline"
                  className="h-auto p-4 text-left justify-start bg-transparent"
                  onClick={() => handleQuickQuestion(item.question)}
                >
                  <div className="flex items-start gap-3">
                    <item.icon className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <div className="font-medium text-sm">{item.question}</div>
                      <Badge variant="secondary" className="mt-1 text-xs">
                        {item.category}
                      </Badge>
                    </div>
                  </div>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Chat Interface */}
      <Card className="h-[500px] flex flex-col">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-green-600" />
            Chat with Mzansi Business Buddy
          </CardTitle>
        </CardHeader>

        <CardContent className="flex-1 flex flex-col p-0">
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {messages.length === 0 && (
                <div className="text-center py-8">
                  <Bot className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-500">
                    Sawubona! I'm your AI business assistant. Ask me anything about starting and running a business in
                    South Africa.
                  </p>
                </div>
              )}

              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`flex gap-3 max-w-[80%] ${message.role === "user" ? "flex-row-reverse" : "flex-row"}`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        message.role === "user" ? "bg-blue-600 text-white" : "bg-green-600 text-white"
                      }`}
                    >
                      {message.role === "user" ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
                    </div>
                    <div
                      className={`rounded-lg p-3 ${
                        message.role === "user" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                    </div>
                  </div>
                </div>
              ))}

              {isLoading && (
                <div className="flex gap-3 justify-start">
                  <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center">
                    <Bot className="h-4 w-4" />
                  </div>
                  <div className="bg-gray-100 rounded-lg p-3">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.1s" }}
                      ></div>
                      <div
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                      ></div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ScrollArea>

          <div className="border-t p-4">
            <form onSubmit={handleSubmit} className="flex gap-2">
              <Input
                value={input}
                onChange={handleInputChange}
                placeholder={`Ask me anything in ${selectedLanguage}...`}
                className="flex-1"
                disabled={isLoading}
              />
              <Button type="submit" disabled={isLoading || !input.trim()}>
                <Send className="h-4 w-4" />
              </Button>
            </form>
          </div>
        </CardContent>
      </Card>

      {/* Help Section */}
      <Card className="bg-green-50 border-green-200">
        <CardContent className="p-4">
          <h4 className="font-semibold text-green-800 mb-2">💡 What I can help you with:</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-green-700">
            <div>
              <h5 className="font-medium mb-1">Business Registration:</h5>
              <ul className="space-y-1 text-xs">
                <li>• CIPC registration process</li>
                <li>• Choosing business structure</li>
                <li>• Required documents</li>
                <li>• Costs and timelines</li>
              </ul>
            </div>
            <div>
              <h5 className="font-medium mb-1">Financial Planning:</h5>
              <ul className="space-y-1 text-xs">
                <li>• Tax obligations</li>
                <li>• Business banking</li>
                <li>• Funding options</li>
                <li>• Financial projections</li>
              </ul>
            </div>
            <div>
              <h5 className="font-medium mb-1">Marketing & Growth:</h5>
              <ul className="space-y-1 text-xs">
                <li>• Digital marketing strategies</li>
                <li>• Social media tips</li>
                <li>• Customer acquisition</li>
                <li>• Brand building</li>
              </ul>
            </div>
            <div>
              <h5 className="font-medium mb-1">Compliance & Legal:</h5>
              <ul className="space-y-1 text-xs">
                <li>• Employment law</li>
                <li>• Consumer protection</li>
                <li>• Industry regulations</li>
                <li>• Contract templates</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
