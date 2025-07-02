"use client"

import { db } from "@/configs"
import { JsonForms } from "@/configs/Schema"
import { useUser } from "@clerk/nextjs"
import { desc, eq } from "drizzle-orm"
import { useEffect, useState } from "react"
import Formitem from "./Formitem"

function FormList() {
  const { user } = useUser()
  const [formList, setFormList] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    user && GetFormList()
  }, [user])

  const GetFormList = async () => {
    try {
      setLoading(true)
      const result = await db
        .select()
        .from(JsonForms)
        .where(eq(JsonForms.createdBy, user?.primaryEmailAddress?.emailAddress))
        .orderBy(desc(JsonForms.id))

      setFormList(result)
      console.log(result)
    } catch (error) {
      console.error("Error fetching forms:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
        {[...Array(6)].map((_, index) => (
          <div key={index} className="animate-pulse">
            <div className="bg-gray-200 rounded-xl h-40 sm:h-48"></div>
          </div>
        ))}
      </div>
    )
  }

  if (formList.length === 0) {
    return (
      <div className="text-center py-8 sm:py-12">
        <div className="w-16 h-16 sm:w-24 sm:h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8 sm:w-12 sm:h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
            />
          </svg>
        </div>
        <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">No forms yet</h3>
        <p className="text-sm sm:text-base text-gray-500 mb-6">Create your first AI-powered form to get started</p>
      </div>
    )
  }

  return (
    <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
      {formList.map((form, ind) => (
        <div key={form.id || ind} className="h-full">
          <Formitem jsonform={JSON.parse(form.jsonform)} formRecord={form} refreshData={GetFormList} />
        </div>
      ))}
    </div>
  )
}

export default FormList
