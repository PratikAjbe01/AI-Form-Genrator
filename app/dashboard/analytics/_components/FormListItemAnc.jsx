"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { db } from "@/configs"
import { userResponses } from "@/configs/Schema"
import { eq } from "drizzle-orm"
import { BarChart3, Loader2, FileText } from "lucide-react"
import Link from "next/link"
import { useEffect, useState } from "react"

function FormListItemAnc({ jsonForm, formRecord }) {
  const [loading, setLoading] = useState(false)
  const [response, setresponse] = useState(0)

  useEffect(() => {
    const getresp = async () => {
      const result = await db.select().from(userResponses).where(eq(userResponses.formRef, formRecord.id))
      setresponse(result.length)
    }
    getresp()
  }, [])

  return (
    <Card className="border-2 border-gray-200 hover:border-blue-300 transition-all duration-300 hover:shadow-lg">
      <CardContent className="p-6">
        <div className="flex items-start mb-4">
          <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
            <FileText className="w-6 h-6 text-purple-600" />
          </div>
          <div className="flex-1">
            <h2 className="font-bold text-lg text-gray-900 mb-1">{jsonForm?.form_title}</h2>
            <p className="text-sm text-gray-500 line-clamp-2">{jsonForm?.form_description}</p>
          </div>
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-gray-100">
          <div>
            <p className="text-2xl font-bold text-purple-600">{response}</p>
            <p className="text-sm text-gray-500">Responses</p>
          </div>
          <Link href={`/dashboard/analytics/${formRecord.id}?name=${jsonForm?.form_title}`}>
            <Button
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
              size="sm"
              disabled={loading}
            >
              {loading ? <Loader2 className="animate-spin h-4 w-4" /> : <BarChart3 className="h-4 w-4 mr-2" />}
              {loading ? "Loading..." : "View Analytics"}
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

export default FormListItemAnc
