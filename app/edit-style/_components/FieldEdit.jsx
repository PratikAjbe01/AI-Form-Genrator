'use client'
import { Edit, Trash } from 'lucide-react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
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
import React, { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

function FieldEdit({ defaultValue, onUpdate, onDelete }) {
  const [label, setLabel] = useState(defaultValue.question || '');
  const [placeholder, setPlaceholder] = useState(defaultValue.placeholder || '');

  // Update state when defaultValue changes
  useEffect(() => {
    setLabel(defaultValue.question || '');
    setPlaceholder(defaultValue.placeholder || '');
  }, [defaultValue]);

  const handleUpdate = () => {
    onUpdate({
      label: label,
      placeholder: placeholder
    });
  };

  return (
    <div className='flex gap-2'>
      <Popover>
        <PopoverTrigger>
          <Edit className='h-4 w-4 text-gray-500'/>
        </PopoverTrigger>
        <PopoverContent className="space-y-3">
          <h2 className="font-medium">Edit Field</h2>
          <div>
            <label className='text-xs block mb-1'>Label name</label>
            <Input 
              type='text' 
              value={label} 
              onChange={(e) => setLabel(e.target.value)} 
            />
          </div>
          <div>
            <label className='text-xs block mb-1'>Set Placeholder</label>
            <Input 
              type='text' 
              value={placeholder} 
              onChange={(e) => setPlaceholder(e.target.value)} 
            />
          </div>
          <Button 
            size="sm" 
            className='mt-2 bg-indigo-600 hover:bg-indigo-700' 
            onClick={handleUpdate}
          >
            Update
          </Button>
        </PopoverContent>
      </Popover>


      
        <AlertDialog>
  <AlertDialogTrigger>  <Trash className='h-4 w-4 text-red-500'/></AlertDialogTrigger>
  <AlertDialogContent>
    <AlertDialogHeader>
      <AlertDialogTitle>Do you want to delete the field?</AlertDialogTitle>
      <AlertDialogDescription>
     {label} 
      </AlertDialogDescription>
    </AlertDialogHeader>
    <AlertDialogFooter>
      <AlertDialogCancel>Cancel</AlertDialogCancel>
      <AlertDialogAction className='bg-indigo-600 hover:bg-indigo-700' onClick={onDelete}>Delete</AlertDialogAction>
    </AlertDialogFooter>
  </AlertDialogContent>
</AlertDialog>
    
    </div>
  )
}

export default FieldEdit;