"use client"

import { Button } from "@/components/ui/button"
import { Share, Edit, Trash } from "lucide-react"
import Link from "next/link"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Card, CardContent } from "@/components/ui/card"

import { and, eq } from "drizzle-orm"
import { useUser } from "@clerk/nextjs"


import { useState } from "react"
import { JsonForms } from "@/app/configs/Schema"
import { db } from "@/app/configs"

const Formitem = ({ formRecord, jsonform, refreshData }) => {
  const { user } = useUser()
  const [isDeleting, setIsDeleting] = useState(false)

  const onDeleteForm = async () => {
    setIsDeleting(true)
    try {
      const result = await db
        .delete(JsonForms)
        .where(and(eq(JsonForms.id, formRecord.id), eq(JsonForms.createdBy, user?.primaryEmailAddress?.emailAddress)))
      if (result) {
        console.log("formDeleted")
        refreshData()
      }
    } catch (error) {
      console.error("Error deleting form:", error)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <Card className="border border-gray-200 hover:border-indigo-300 transition-all duration-300 hover:shadow-lg group h-full">
      <CardContent className="p-3 sm:p-6 h-full flex flex-col">
        {/* Header with title and delete button */}
        <div className="flex justify-between items-start gap-2 mb-4">
          <div className="flex-1 min-w-0 pr-2">
            <h2 className="font-bold text-sm sm:text-lg text-gray-900 mb-1 sm:mb-2 group-hover:text-indigo-600 transition-colors line-clamp-2 break-words">
              {jsonform?.form_title || "Untitled Form"}
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 line-clamp-2 break-words">
              {jsonform?.form_description || "No description available"}
            </p>
          </div>

          {/* Delete button - always visible but smaller on mobile */}
          <div className="flex-shrink-0">
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-500 hover:text-red-700 hover:bg-red-50 h-7 w-7 sm:h-8 sm:w-8 p-0"
                >
                  <Trash className="h-3 w-3 sm:h-4 sm:w-4" />
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent className="max-w-sm sm:max-w-lg">
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-base sm:text-lg">Delete Form</AlertDialogTitle>
                  <AlertDialogDescription className="text-sm">
                    Are you sure you want to delete "{jsonform?.form_title}"? This action cannot be undone and will
                    permanently remove all associated data.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="flex-col sm:flex-row gap-2">
                  <AlertDialogCancel className="w-full sm:w-auto">Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    className="w-full sm:w-auto bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
                    onClick={onDeleteForm}
                    disabled={isDeleting}
                  >
                    {isDeleting ? "Deleting..." : "Delete Form"}
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>

        {/* Action buttons - responsive layout */}
        <div className="flex flex-col sm:flex-row gap-2 mt-auto">
       <Button
  variant="outline"
  size="sm"
  className="w-full sm:flex-1 border-gray-300 hover:border-indigo-400 hover:bg-indigo-50 bg-transparent text-xs sm:text-sm"
  onClick={() => {
    if (navigator.share) {
      navigator
        .share({
          title: jsonform?.form_title,
          text: `${jsonform?.form_title} — Build your form in seconds with AI Form Builder!`,
          url: `${process.env.NEXT_PUBLIC_BASE_URL}/aiform/${formRecord?.id}`,
        })
        .then(() => console.log("✅ Shared successfully"))
        .catch((error) => console.error("❌ Sharing failed", error))
    } else {
      alert("Web Share API is not supported in your browser.")
    }
  }}
>
  <Share className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
  Share
</Button>


          <Link href={"/edit-style/" + formRecord?.id} className="w-full sm:flex-1">
            <Button
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-xs sm:text-sm"
              size="sm"
            >
              <Edit className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              Edit
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}

export default Formitem
