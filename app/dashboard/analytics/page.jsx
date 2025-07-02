"use client"

import { db } from "@/app/configs"
import { useUser } from "@clerk/nextjs"
import { eq } from "drizzle-orm"
import { useEffect, useState } from "react"
import FormListItemAnc from "./_components/FormListItemAnc"
import { JsonForms } from "@/app/configs/Schema"

function Analytics() {
  const { user } = useUser()
  const [formList, setFormList] = useState()

  useEffect(() => {
    user && getFormList()
  }, [user])

  const getFormList = async () => {
    const result = await db
      .select()
      .from(JsonForms)
      .where(eq(JsonForms.createdBy, user?.primaryEmailAddress?.emailAddress))

    setFormList(result)
  }

  return (
    formList && (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div className="mb-8">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Analytics
            </h1>
            <p className="text-gray-600 mt-2">Analyze your form performance</p>
          </div>

          {/* Analytics Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {formList &&
              formList?.map((form, index) => (
                <FormListItemAnc key={index} formRecord={form} jsonForm={JSON.parse(form.jsonform)} />
              ))}
          </div>
        </div>
      </div>
    )
  )
}

export default Analytics
