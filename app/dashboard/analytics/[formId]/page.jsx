"use client"

import { useParams, useSearchParams } from "next/navigation"
import { useEffect, useState } from "react"
import { db } from "@/configs"
import { userResponses } from "@/configs/Schema"
import { eq } from "drizzle-orm"
import { GoogleGenerativeAI } from "@google/generative-ai"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { BarChart3, Users, FileText, Sparkles } from "lucide-react"

function AnalyticsDetail() {
  const { formId } = useParams()
  const [data, setData] = useState([])
  const [fields, setFields] = useState([])
  const searchParams = useSearchParams()
  const name = searchParams.get("name")
  const [loading, setLoading] = useState(true)
  const [aiSummary, setAiSummary] = useState("")

  useEffect(() => {
    const fetchResponses = async () => {
      const result = await db.select().from(userResponses).where(eq(userResponses.formRef, formId))
      const parsed = result.map((item) => ({ ...JSON.parse(item.jsonResponse), userId: item.userId }))
      setData(parsed)
      setFields(Object.keys(parsed?.[0] || {}))
      setLoading(false)
    }

    fetchResponses()
  }, [formId])

  if (loading) return <p className="p-4">Loading...</p>

  const totalResponses = data.length
  const users = [...new Set(data.map((d) => d.userId))]

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Analytics for {name}
          </h1>
          <p className="text-gray-600">Detailed insights and performance metrics</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card className="border-2 border-blue-100 hover:border-blue-300 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Total Responses</p>
                  <p className="text-3xl font-bold text-blue-600">{totalResponses}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-2 border-purple-100 hover:border-purple-300 transition-colors">
            <CardContent className="p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                  <Users className="w-6 h-6 text-purple-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Unique Users</p>
                  <p className="text-3xl font-bold text-purple-600">{users.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Field Distributions */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <h2 className="text-2xl font-semibold mb-6 flex items-center">
              <BarChart3 className="w-6 h-6 mr-2 text-blue-600" />
              Field Distributions
            </h2>
            {fields.map((field) => {
              const fieldData = data.reduce((acc, item) => {
                const value = item[field] || "N/A"
                acc[value] = (acc[value] || 0) + 1
                return acc
              }, {})

              const chartData = Object.entries(fieldData).map(([key, value]) => ({
                name: key,
                count: value,
              }))

              return (
                <div key={field} className="mb-8">
                  <h3 className="font-medium mb-4 text-lg">{field}</h3>
                  <ResponsiveContainer width="100%" height={250}>
                    <BarChart data={chartData}>
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="url(#gradient)" />
                      <defs>
                        <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#3B82F6" />
                          <stop offset="100%" stopColor="#8B5CF6" />
                        </linearGradient>
                      </defs>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              )
            })}
          </CardContent>
        </Card>

        {/* User Data Table */}
        <Card className="mb-8">
          <CardContent className="p-6">
            <h2 className="text-2xl font-semibold mb-6">Response Data</h2>
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
          </CardContent>
        </Card>

        {/* AI Summary Section */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold flex items-center">
                <Sparkles className="w-6 h-6 mr-2 text-purple-600" />
                AI Insights
              </h2>
              <Button
                onClick={generateSummary}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              >
                Generate AI Summary
              </Button>
            </div>

            {aiSummary && !aiSummary.error && (
              <div className="space-y-6 bg-gradient-to-r from-blue-50 to-purple-50 p-6 rounded-lg">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Key Insights</h3>
                  <ul className="list-disc ml-6 space-y-1 text-gray-700">
                    {aiSummary.keyInsights?.map((insight, idx) => (
                      <li key={idx}>{insight}</li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Summary Statistics</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(aiSummary.summaryStatistics || {}).map(([key, val], idx) => (
                      <div key={idx} className="bg-white p-3 rounded-lg">
                        <span className="font-medium text-gray-900">{key}:</span>
                        <span className="ml-2 text-gray-700">{val}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Recommendations</h3>
                  <ol className="list-decimal ml-6 space-y-1 text-gray-700">
                    {aiSummary.possibleRecommendations?.map((rec, idx) => (
                      <li key={idx}>{rec}</li>
                    ))}
                  </ol>
                </div>
              </div>
            )}

            {aiSummary.error && <p className="text-red-500 bg-red-50 p-4 rounded-lg">{aiSummary.error}</p>}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default AnalyticsDetail
