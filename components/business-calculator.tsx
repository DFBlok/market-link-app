"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Calculator, TrendingUp, DollarSign, PieChart } from "lucide-react"

export default function BusinessCalculator() {
  const [profitData, setProfitData] = useState({
    revenue: "",
    costs: "",
    profit: 0,
    margin: 0,
  })

  const [cashFlowData, setCashFlowData] = useState({
    income: "",
    expenses: "",
    cashFlow: 0,
  })

  const calculateProfit = () => {
    const revenue = Number.parseFloat(profitData.revenue) || 0
    const costs = Number.parseFloat(profitData.costs) || 0
    const profit = revenue - costs
    const margin = revenue > 0 ? (profit / revenue) * 100 : 0

    setProfitData((prev) => ({
      ...prev,
      profit,
      margin,
    }))
  }

  const calculateCashFlow = () => {
    const income = Number.parseFloat(cashFlowData.income) || 0
    const expenses = Number.parseFloat(cashFlowData.expenses) || 0
    const cashFlow = income - expenses

    setCashFlowData((prev) => ({
      ...prev,
      cashFlow,
    }))
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Business Calculator</h2>
        <p className="text-gray-600">Simple tools to help you understand your business finances</p>
      </div>

      <Tabs defaultValue="profit" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profit">Profit</TabsTrigger>
          <TabsTrigger value="cashflow">Cash Flow</TabsTrigger>
          <TabsTrigger value="pricing">Pricing</TabsTrigger>
          <TabsTrigger value="breakeven">Break Even</TabsTrigger>
        </TabsList>

        <TabsContent value="profit">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                Profit Calculator
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="revenue">Monthly Revenue (R)</Label>
                    <Input
                      id="revenue"
                      type="number"
                      placeholder="e.g., 15000"
                      value={profitData.revenue}
                      onChange={(e) => setProfitData((prev) => ({ ...prev, revenue: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="costs">Monthly Costs (R)</Label>
                    <Input
                      id="costs"
                      type="number"
                      placeholder="e.g., 8000"
                      value={profitData.costs}
                      onChange={(e) => setProfitData((prev) => ({ ...prev, costs: e.target.value }))}
                    />
                  </div>
                  <Button onClick={calculateProfit} className="w-full">
                    Calculate Profit
                  </Button>
                </div>

                <div className="space-y-4">
                  <Card className="bg-green-50 border-green-200">
                    <CardContent className="p-4">
                      <div className="text-center">
                        <DollarSign className="h-8 w-8 text-green-600 mx-auto mb-2" />
                        <h3 className="font-semibold text-green-800">Monthly Profit</h3>
                        <p className="text-2xl font-bold text-green-600">R {profitData.profit.toLocaleString()}</p>
                      </div>
                    </CardContent>
                  </Card>

                  <Card className="bg-blue-50 border-blue-200">
                    <CardContent className="p-4">
                      <div className="text-center">
                        <PieChart className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                        <h3 className="font-semibold text-blue-800">Profit Margin</h3>
                        <p className="text-2xl font-bold text-blue-600">{profitData.margin.toFixed(1)}%</p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <h4 className="font-semibold text-yellow-800 mb-2">💡 Understanding Your Results:</h4>
                <ul className="text-sm text-yellow-700 space-y-1">
                  <li>• A good profit margin is typically 10-20% for most businesses</li>
                  <li>• If your margin is low, consider reducing costs or increasing prices</li>
                  <li>• Track this monthly to see your business trends</li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="cashflow">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calculator className="h-5 w-5 text-blue-600" />
                Cash Flow Calculator
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="income">Monthly Income (R)</Label>
                    <Input
                      id="income"
                      type="number"
                      placeholder="e.g., 20000"
                      value={cashFlowData.income}
                      onChange={(e) => setCashFlowData((prev) => ({ ...prev, income: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="expenses">Monthly Expenses (R)</Label>
                    <Input
                      id="expenses"
                      type="number"
                      placeholder="e.g., 12000"
                      value={cashFlowData.expenses}
                      onChange={(e) => setCashFlowData((prev) => ({ ...prev, expenses: e.target.value }))}
                    />
                  </div>
                  <Button onClick={calculateCashFlow} className="w-full">
                    Calculate Cash Flow
                  </Button>
                </div>

                <div>
                  <Card
                    className={`${cashFlowData.cashFlow >= 0 ? "bg-green-50 border-green-200" : "bg-red-50 border-red-200"}`}
                  >
                    <CardContent className="p-4">
                      <div className="text-center">
                        <DollarSign
                          className={`h-8 w-8 mx-auto mb-2 ${cashFlowData.cashFlow >= 0 ? "text-green-600" : "text-red-600"}`}
                        />
                        <h3
                          className={`font-semibold ${cashFlowData.cashFlow >= 0 ? "text-green-800" : "text-red-800"}`}
                        >
                          Net Cash Flow
                        </h3>
                        <p
                          className={`text-2xl font-bold ${cashFlowData.cashFlow >= 0 ? "text-green-600" : "text-red-600"}`}
                        >
                          R {cashFlowData.cashFlow.toLocaleString()}
                        </p>
                        <p className="text-sm mt-2">
                          {cashFlowData.cashFlow >= 0 ? "✅ Positive cash flow" : "⚠️ Negative cash flow"}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <h4 className="font-semibold text-blue-800 mb-2">💡 What is Cash Flow?</h4>
                <p className="text-sm text-blue-700">
                  Cash flow is the money coming in minus the money going out. Positive cash flow means you have money
                  left over each month. Negative cash flow means you're spending more than you earn - this needs urgent
                  attention!
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pricing">
          <Card>
            <CardHeader>
              <CardTitle>Pricing Calculator</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">
                Coming soon - Calculate optimal pricing for your products and services
              </p>
              <div className="bg-gray-100 rounded-lg p-8 text-center">
                <Calculator className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Feature in development</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="breakeven">
          <Card>
            <CardHeader>
              <CardTitle>Break-Even Calculator</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4">Coming soon - Find out how much you need to sell to break even</p>
              <div className="bg-gray-100 rounded-lg p-8 text-center">
                <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">Feature in development</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
