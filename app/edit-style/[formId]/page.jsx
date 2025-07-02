"use client"

import { db } from "@/configs"
import { JsonForms } from "@/configs/Schema"
import { useUser } from "@clerk/nextjs"
import { and, eq } from "drizzle-orm"
import { ArrowLeft, Share, SquareArrowUpRight } from "lucide-react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import FormUi from "../_components/FormUi"
import Controller from "../_components/Controller"
import { Button } from "@/components/ui/button"
import Link from "next/link"


function page({ params }) {
  const router = useRouter()
  const { user } = useUser()
  const [JsonForm, setJsonForm] = useState([])
  const [record, setRecord] = useState([])
  const [selectTheme, setSelectTheme] = useState("light")
  const [selectedBackground, setselectedBackground] = useState()
  const [selectedStyle, setSlectedStyle] = useState()

  useEffect(() => {
    console.log("Fetched", JsonForm)
  }, [JsonForm])

  useEffect(() => {
    user && getFormData()
  }, [user])

  const getFormData = async () => {
    const reuslt = await db
      .select()
      .from(JsonForms)
      .where(and(eq(JsonForms.id, params?.formId), eq(JsonForms.createdBy, user?.primaryEmailAddress?.emailAddress)))
    console.log("result for id:", reuslt[0].id)
    setRecord(reuslt[0])
    const parsedForm = JSON.parse(reuslt[0].jsonform)
    setJsonForm(parsedForm)
    setSelectTheme(reuslt[0].theme)
    setselectedBackground(reuslt[0].background)
    console.log(reuslt[0].background)
  }

  const updateControllerFields = async (value, columnName) => {
    const result = await db
      .update(JsonForms)
      .set({
        [columnName]: value,
      })
      .where(and(eq(JsonForms.id, record.id), eq(JsonForms.createdBy, user?.primaryEmailAddress.emailAddress)))
    console.log("updated theme")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
      <div className="px-6 lg:px-10 py-6">
        <div className="flex justify-between items-center mb-8">
          <h2
            onClick={() => router.back()}
            className="flex gap-3 items-center text-lg font-semibold text-gray-700 cursor-pointer hover:text-indigo-600 transition-all duration-200 group"
          >
            <ArrowLeft className="group-hover:-translate-x-1 transition-transform duration-200" />
            Back to Dashboard
          </h2>
          <div className="flex gap-3">
            <Link href={"/aiform/" + record?.id} target="_blank">
              <Button className="flex gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-200">
                <SquareArrowUpRight className="h-4 w-4" />
                Live Preview
              </Button>
            </Link>
           <Button
  variant="outline"
  size="sm"
  className="flex gap-2 border-indigo-200 hover:border-indigo-300 hover:bg-indigo-50 transition-all duration-200 bg-transparent"
  onClick={() => {
    if (navigator.share) {
      navigator
        .share({
          title: JsonForm?.form_title,
          text: JsonForm?.form_title + " , Build your form in seconds with AI Form Builder",
          url: process.env.NEXT_PUBLIC_BASE_URL + "/aiform/" + record?.id,
        })
        .then(() => console.log("✅ Shared successfully"))
        .catch((error) => console.error("❌ Share failed:", error));
    } else {
      navigator.clipboard.writeText(
        process.env.NEXT_PUBLIC_BASE_URL + "/aiform/" + record?.id
      );
      alert("Link copied to clipboard!");
    }
  }}
>
  <Share className="h-4 w-4" />
  Share
</Button>

          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-6 sticky top-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-6 flex items-center gap-2">
                <div className="w-2 h-2 bg-indigo-500 rounded-full"></div>
                Customize Form
              </h3>
              <Controller
                selectTheme={(value) => {
                  updateControllerFields(value, "theme")
                  setSelectTheme(value)
                }}
                selectedBackground={(value) => {
                  updateControllerFields(value, "background")
                  setselectedBackground(value)
                }}
                selectedStyle={(value) => {
                  setSlectedStyle(value)
                  updateControllerFields(value, "style")
                }}
              />
            </div>
          </div>

          <div className="lg:col-span-2">
            <div
              className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 min-h-[80vh]"
              style={{ backgroundImage: selectedBackground }}
            >
              <div className="flex justify-center">
                <FormUi
                  JsonForm={JsonForm}
                  setJsonForm={setJsonForm}
                  selectedStyle={selectedStyle}
                  selectTheme={selectTheme}
                  record={record}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default page
