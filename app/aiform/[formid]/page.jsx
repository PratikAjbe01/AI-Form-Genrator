"use client"

import FormUi from "@/app/edit-style/_components/FormUi"
import { db } from "@/configs"
import { JsonForms } from "@/configs/Schema"
import { eq } from "drizzle-orm"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"

function LiveForm({ params }) {
  const [record, setRecord] = useState()
  const [jsonform, setJsonForm] = useState([])
  const [selectedStyle, setSlectedStyle] = useState()

  useEffect(() => {
    params && getFormData()
  }, [params])

  const getFormData = async () => {
    const result = await db
      .select()
      .from(JsonForms)
      .where(eq(JsonForms.id, Number(params?.formid)))
    setRecord(result[0])
    setSlectedStyle(JSON.parse(result[0]?.style))
    setJsonForm(JSON.parse(result[0].jsonform))
    console.log("result", result)
  }

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30 py-12"
      style={{ backgroundImage: record?.background }}
    >
      <div className="container mx-auto px-4">
        <FormUi
          JsonForm={jsonform}
          setJsonForm={setJsonForm}
          record={record}
          selectedStyle={record?.style}
          editable={false}
          selectTheme={record?.theme}
        />
      </div>

      <Link
        href={process.env.NEXT_PUBLIC_BASE_URL}
        className="flex gap-3 items-center bg-gradient-to-r from-gray-900 to-gray-800 text-white px-4 py-3 rounded-full fixed bottom-6 left-6 cursor-pointer shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 group"
      >
        <Image
          src={"/icon.png"}
          alt="icon"
          height={24}
          width={24}
          className="group-hover:rotate-12 transition-transform duration-200"
        />
        <span className="font-medium">Build Your Own AI Form</span>
      </Link>
    </div>
  )
}

export default LiveForm
