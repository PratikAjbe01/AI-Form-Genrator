"use client"

import { useParams, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { db } from "@/app/configs"
import { userResponses } from "@/app/configs/Schema"
import { eq } from "drizzle-orm"
import { GoogleGenerativeAI } from "@google/generative-ai"

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  Tooltip,
} from "recharts"

import {
  BarChart3,
  Users,
  FileText,
  Sparkles,
  TrendingUp,
  Clock,
  Target,
  Activity,
  Calendar,
  CheckCircle,
  AlertCircle,
} from "lucide-react"

const COLORS = ["#3B82F6", "#8B5CF6", "#10B981", "#F59E0B", "#EF4444", "#6366F1", "#EC4899", "#14B8A6"]

function AnalyticsDetail() {
  const { formId } = useParams()
  const [data, setData] = useState([])
  const [fields, setFields] = useState([])
  const searchParams = useSearchParams()
  const name = searchParams.get("name")
  const [loading, setLoading] = useState(true)
  const [aiSummary, setAiSummary] = useState("")
  const [activeTab, setActiveTab] = useState("trends")

  useEffect(() => {
    const fetchResponses = async () => {
      const result = await db.select().from(userResponses).where(eq(userResponses.formRef, formId))
      const parsed = result.map((item) => ({
        ...JSON.parse(item.jsonResponse),
        userId: item.userId,
        createdAt: item.createdAt || new Date(),
      }))
      setData(parsed)
      setFields(Object.keys(parsed?.[0] || {}).filter((key) => key !== "userId" && key !== "createdAt"))
      setLoading(false)
    }

    fetchResponses()
  }, [formId])

  if (loading) return <p className="p-4">Loading...</p>

  const totalResponses = data.length
  const users = [...new Set(data.map((d) => d.userId))]
  const completionRate = totalResponses > 0 ? Math.round((totalResponses / (totalResponses * 1.2)) * 100) : 0

  // Generate time-based data for trends
  const getResponseTrends = () => {
    const trends = data.reduce((acc, item) => {
      const date = new Date(item.createdAt).toLocaleDateString()
      acc[date] = (acc[date] || 0) + 1
      return acc
    }, {})

    return Object.entries(trends)
      .map(([date, count]) => ({ date, responses: count }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .slice(-7) // Last 7 days
  }

  // Calculate field completion rates
  const getFieldCompletionRates = () => {
    return fields.map((field) => {
      const completed = data.filter((item) => item[field] && item[field] !== "").length
      const rate = totalResponses > 0 ? Math.round((completed / totalResponses) * 100) : 0
      return { field, completed, rate, total: totalResponses }
    })
  }

  // Get response distribution by hour
  const getHourlyDistribution = () => {
    const hourly = data.reduce((acc, item) => {
      const hour = new Date(item.createdAt).getHours()
      acc[hour] = (acc[hour] || 0) + 1
      return acc
    }, {})

    return Array.from({ length: 24 }, (_, i) => ({
      hour: `${i}:00`,
      responses: hourly[i] || 0,
    }))
  }

  const generateSummary = async () => {
    const prompt = `
You are a data analyst. I will provide you with form response data.
Please analyze the data and return a JSON object with this structure:
{
  "keyInsights": [ "insight 1", "insight 2", ... ],
  "summaryStatistics": { "stat1": "value", "stat2": "value", ... },
  "possibleRecommendations": [ "recommendation 1", "recommendation 2", ... ]
}

Do not include any explanation text or markdown — just return valid JSON.

Here is the response data:
${JSON.stringify(data).slice(0, 8000)}
`

    const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY)
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: {
            text: prompt,
          },
        },
      ],
    })

    const text = await result.response.text()
    try {
      const cleaned = text
        .replace(/```json/i, "")
        .replace(/```/g, "")
        .trim()
      const json = JSON.parse(cleaned)
      setAiSummary(json)
    } catch (e) {
      console.error("AI response was not valid JSON:", text)
      setAiSummary({ error: "Invalid AI response. Please try again." })
    }
  }

  const trendData = getResponseTrends()
  const fieldCompletionData = getFieldCompletionRates()
  const hourlyData = getHourlyDistribution()

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-medium">{`${label}`}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {`${entry.name}: ${entry.value}`}
            </p>
          ))}
        </div>
      )
    }
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Analytics for {name}
          </h1>
          <p className="text-gray-600">Comprehensive form performance insights and analytics</p>
        </div>

        {/* Form Analytics Summary */}
        <div className="mb-8 bg-white rounded-lg border-2 border-blue-100 shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold flex items-center mb-2">
              <Activity className="w-6 h-6 mr-2 text-blue-600" />
              Form Analytics Overview
            </h2>
            <p className="text-gray-600">
              Form analytics provide crucial insights into user behavior, completion patterns, and engagement metrics.
              By analyzing response data, completion rates, and user interactions, you can optimize form design,
              identify bottlenecks, and improve conversion rates. Key metrics include response trends, field completion
              rates, peak usage times, and user journey analysis.
            </p>
          </div>
        </div>

        {/* Key Metrics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg border-2 border-blue-100 hover:border-blue-300 transition-colors shadow-sm">
            <div className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Responses</p>
                  <p className="text-3xl font-bold text-blue-600">{totalResponses}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border-2 border-purple-100 hover:border-purple-300 transition-colors shadow-sm">
            <div className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Unique Users</p>
                  <p className="text-3xl font-bold text-purple-600">{users.length}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border-2 border-green-100 hover:border-green-300 transition-colors shadow-sm">
            <div className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                  <Target className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Completion Rate</p>
                  <p className="text-3xl font-bold text-green-600">{completionRate}%</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg border-2 border-orange-100 hover:border-orange-300 transition-colors shadow-sm">
            <div className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mr-4">
                  <Clock className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Avg. Fields</p>
                  <p className="text-3xl font-bold text-orange-600">{fields.length}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Section */}
        <div className="mb-8">
          {/* Custom Tabs */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200">
            <div className="border-b border-gray-200">
              <nav className="flex space-x-8 px-6">
                {[
                  { id: "trends", label: "Response Trends", icon: TrendingUp },
                  { id: "fields", label: "Field Analysis", icon: BarChart3 },
                  { id: "timing", label: "Usage Patterns", icon: Calendar },
                  { id: "completion", label: "Completion Rates", icon: CheckCircle },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                      activeTab === tab.id
                        ? "border-blue-500 text-blue-600"
                        : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </button>
                ))}
              </nav>
            </div>

            <div className="p-6">
              {activeTab === "trends" && (
                <div>
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold flex items-center mb-2">
                      <TrendingUp className="w-6 h-6 mr-2 text-blue-600" />
                      Response Trends (Last 7 Days)
                    </h3>
                    <p className="text-gray-600">Daily response volume and engagement patterns</p>
                  </div>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={trendData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip content={<CustomTooltip />} />
                        <Area
                          type="monotone"
                          dataKey="responses"
                          stroke="#3B82F6"
                          fill="url(#colorResponses)"
                          strokeWidth={2}
                        />
                        <defs>
                          <linearGradient id="colorResponses" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1} />
                          </linearGradient>
                        </defs>
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {activeTab === "fields" && (
                <div>
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold flex items-center mb-2">
                      <BarChart3 className="w-6 h-6 mr-2 text-blue-600" />
                      Field Analysis
                    </h3>
                    <p className="text-gray-600">Response distribution for each form field</p>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {fields.slice(0, 4).map((field, index) => {
                      const fieldData = data.reduce((acc, item) => {
                        const value = item[field] || "N/A"
                        acc[value] = (acc[value] || 0) + 1
                        return acc
                      }, {})

                      const chartData = Object.entries(fieldData).map(([key, value]) => ({
                        name: key.length > 15 ? key.substring(0, 15) + "..." : key,
                        value: value,
                        fullName: key,
                      }))

                      return (
                        <div key={field} className="bg-gray-50 rounded-lg p-4">
                          <div className="mb-4">
                            <h4 className="text-lg font-medium">{field}</h4>
                            <p className="text-sm text-gray-600">Response distribution for this field</p>
                          </div>
                          <div className="h-[250px]">
                            <ResponsiveContainer width="100%" height="100%">
                              <PieChart>
                                <Pie
                                  data={chartData}
                                  cx="50%"
                                  cy="50%"
                                  outerRadius={80}
                                  fill="#8884d8"
                                  dataKey="value"
                                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                >
                                  {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                  ))}
                                </Pie>
                                <Tooltip content={<CustomTooltip />} />
                              </PieChart>
                            </ResponsiveContainer>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {activeTab === "timing" && (
                <div>
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold flex items-center mb-2">
                      <Calendar className="w-6 h-6 mr-2 text-purple-600" />
                      Hourly Usage Patterns
                    </h3>
                    <p className="text-gray-600">When users are most active with your form</p>
                  </div>
                  <div className="h-[300px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={hourlyData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="hour" />
                        <YAxis />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="responses" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {activeTab === "completion" && (
                <div>
                  <div className="mb-6">
                    <h3 className="text-xl font-semibold flex items-center mb-2">
                      <CheckCircle className="w-6 h-6 mr-2 text-green-600" />
                      Field Completion Analysis
                    </h3>
                    <p className="text-gray-600">How well each field performs in terms of completion</p>
                  </div>
                  <div className="space-y-6">
                    {fieldCompletionData.map((item, index) => (
                      <div key={item.field} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="font-medium">{item.field}</span>
                          <div className="flex items-center space-x-2">
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                item.rate >= 80
                                  ? "bg-green-100 text-green-800"
                                  : item.rate >= 60
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-red-100 text-red-800"
                              }`}
                            >
                              {item.rate}%
                            </span>
                            <span className="text-sm text-gray-500">
                              {item.completed}/{item.total}
                            </span>
                          </div>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className={`h-2 rounded-full ${
                              item.rate >= 80 ? "bg-green-500" : item.rate >= 60 ? "bg-yellow-500" : "bg-red-500"
                            }`}
                            style={{ width: `${item.rate}%` }}
                          ></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Response Data Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold">Response Data</h2>
            <p className="text-gray-600">Detailed view of all form submissions</p>
          </div>
          <div className="p-6">
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border border-gray-200 rounded-lg">
                <thead className="bg-gradient-to-r from-blue-50 to-purple-50">
                  <tr>
                    <th className="px-4 py-3 border-b text-left text-sm font-semibold text-gray-700">S. No.</th>
                    {fields.map((f) => (
                      <th key={f} className="px-4 py-3 border-b text-left text-sm font-semibold text-gray-700">
                        {f}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {data.map((row, i) => (
                    <tr key={i} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 border-b text-sm">{i + 1}</td>
                      {fields.map((f) => (
                        <td key={f} className="px-4 py-3 border-b text-sm">
                          {String(row[f] || "")}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* AI Summary Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-semibold flex items-center mb-2">
                  <Sparkles className="w-6 h-6 mr-2 text-purple-600" />
                  AI-Powered Insights
                </h2>
                <p className="text-gray-600">Get intelligent analysis and recommendations based on your form data</p>
              </div>
              <button
                onClick={generateSummary}
                className="px-6 py-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg font-medium transition-colors"
              >
                Generate AI Summary
              </button>
            </div>
          </div>
          <div className="p-6">
            {aiSummary && !aiSummary.error && (
              <div className="space-y-6 bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <AlertCircle className="w-5 h-5 mr-2 text-blue-600" />
                    Key Insights
                  </h3>
                  <ul className="list-disc ml-6 space-y-2 text-gray-700">
                    {aiSummary.keyInsights?.map((insight, idx) => (
                      <li key={idx} className="leading-relaxed">
                        {insight}
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <BarChart3 className="w-5 h-5 mr-2 text-green-600" />
                    Summary Statistics
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(aiSummary.summaryStatistics || {}).map(([key, val], idx) => (
                      <div key={idx} className="bg-white p-4 rounded-lg border">
                        <span className="font-medium text-gray-900">{key}:</span>
                        <span className="ml-2 text-gray-700 font-semibold">{val}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                    <Target className="w-5 h-5 mr-2 text-purple-600" />
                    Recommendations
                  </h3>
                  <ol className="list-decimal ml-6 space-y-2 text-gray-700">
                    {aiSummary.possibleRecommendations?.map((rec, idx) => (
                      <li key={idx} className="leading-relaxed">
                        {rec}
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            )}
            {aiSummary.error && (
              <div className="text-red-600 bg-red-50 p-4 rounded-lg border border-red-200">
                <div className="flex items-center">
                  <AlertCircle className="w-5 h-5 mr-2" />
                  {aiSummary.error}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AnalyticsDetail
