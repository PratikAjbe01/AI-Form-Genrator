"use client"

import { Edit, Trash } from "lucide-react"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
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
import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

function FieldEdit({ defaultValue, onUpdate, onDelete }) {
  const [label, setLabel] = useState(defaultValue.question || "")
  const [placeholder, setPlaceholder] = useState(defaultValue.placeholder || "")

  useEffect(() => {
    setLabel(defaultValue.question || "")
    setPlaceholder(defaultValue.placeholder || "")
  }, [defaultValue])

  const handleUpdate = () => {
    onUpdate({
      label: label,
      placeholder: placeholder,
    })
  }

  return (
    <div className="flex gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <button className="p-2 rounded-lg hover:bg-indigo-50 transition-colors">
            <Edit className="h-4 w-4 text-indigo-600" />
          </button>
        </PopoverTrigger>
        <PopoverContent className="w-80 space-y-4 p-4">
          <h3 className="font-semibold text-gray-800">Edit Field</h3>
          <div className="space-y-3">
            <div>
              <label className="text-xs font-medium text-gray-600 block mb-2">Label Name</label>
              <Input
                type="text"
                value={label}
                onChange={(e) => setLabel(e.target.value)}
                className="border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <div>
              <label className="text-xs font-medium text-gray-600 block mb-2">Placeholder Text</label>
              <Input
                type="text"
                value={placeholder}
                onChange={(e) => setPlaceholder(e.target.value)}
                className="border-gray-200 focus:border-indigo-500 focus:ring-indigo-500"
              />
            </div>
            <Button
              size="sm"
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700"
              onClick={handleUpdate}
            >
              Update Field
            </Button>
          </div>
        </PopoverContent>
      </Popover>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <button className="p-2 rounded-lg hover:bg-red-50 transition-colors">
            <Trash className="h-4 w-4 text-red-500" />
          </button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Field</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{label}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800"
              onClick={onDelete}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

export default FieldEdit
