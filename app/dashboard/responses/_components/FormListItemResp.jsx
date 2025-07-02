"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { db } from "@/app/configs"
import { userResponses } from "@/app/configs/Schema"
import { eq } from "drizzle-orm"
import { Download, Loader2, FileText } from "lucide-react"
import { useEffect, useState } from "react"
import * as XLSX from "xlsx"

function FormListItemResp({ jsonForm, formRecord }) {
  const [loading, setLoading] = useState(false)
  const [response, setresponse] = useState(0)

  useEffect(() => {
    const getresp = async () => {
      const result = await db.select().from(userResponses).where(eq(userResponses.formRef, formRecord.id))
      setresponse(result.length)
    }
    getresp()
  }, [])

  const ExportData = async () => {
    const jsonData = []
    setLoading(true)
    const result = await db.select().from(userResponses).where(eq(userResponses.formRef, formRecord.id))

    if (result) {
      result.forEach((item) => {
        const jsonItem = JSON.parse(item.jsonResponse)
        jsonData.push(jsonItem)
      })
      setLoading(false)
    }
    exportToExcel(jsonData)
  }

  const exportToExcel = (jsonData) => {
    const worksheet = XLSX.utils.json_to_sheet(jsonData)
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1")
    XLSX.writeFile(workbook, jsonForm?.form_title + ".xlsx")
  }

  return (
    <Card className="border-2 border-gray-200 hover:border-blue-300 transition-all duration-300 hover:shadow-lg">
      <CardContent className="p-6">
        <div className="flex items-start mb-4">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
            <FileText className="w-6 h-6 text-blue-600" />
          </div>
          <div className="flex-1">
            <h2 className="font-bold text-lg text-gray-900 mb-1">{jsonForm?.form_title}</h2>
            <p className="text-sm text-gray-500 line-clamp-2">{jsonForm?.form_description}</p>
          </div>
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-gray-100">
          <div>
            <p className="text-2xl font-bold text-blue-600">{response}</p>
            <p className="text-sm text-gray-500">Responses</p>
          </div>
          <Button
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white"
            size="sm"
            onClick={() => ExportData()}
            disabled={loading}
          >
            {loading ? <Loader2 className="animate-spin h-4 w-4" /> : <Download className="h-4 w-4 mr-2" />}
            {loading ? "Exporting..." : "Export"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default FormListItemResp
