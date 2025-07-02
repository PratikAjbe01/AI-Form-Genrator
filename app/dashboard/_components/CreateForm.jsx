'use client'

import React, {  useState } from 'react'
import { GoogleGenerativeAI } from '@google/generative-ai'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { toast } from 'react-toastify'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { useUser } from '@clerk/nextjs'
import { db } from '@/app/configs'
import { JsonForms } from '@/app/configs/Schema'
import moment from 'moment'
import { useRouter } from 'next/navigation'
import { Loader2 } from 'lucide-react' 
import { useAppUser } from '@/app/_context/UserContext'

function CreateForm() {
  const { user } = useUser()
  const router = useRouter() 
 const { appUser,setUpdate,update} = useAppUser()
  const [opendailog, setOpendailog] = useState(false)
  const [userInput, setUserInput] = useState()
  const [loading, setLoading] = useState(false)


  const PROMT =
    "Based on the user description, generate a JSON form with `form_title`, `form_description`, and `fields` including `field_name`, `question`, `input_format`, `is_required`, `placeholder`and `choices` if applicable.add userName and userEmail in every form"

  const genrateForm = async () => {
    console.log(userInput)
    setLoading(true)
    try {
     if(appUser>0){
       const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY)
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })
      const result = await model.generateContent({
        systemInstruction: { text: PROMT },
        contents: [{ role: "user", parts: [{ text: userInput }] }],
      })

      let response = result.response.text()
      let cleanedResponse = response.replace(/^```json\s*|\s*```$/g, '').trim()

      if (cleanedResponse.startsWith('```json')) {
        cleanedResponse = cleanedResponse.substring('```json'.length)
      }
      if (cleanedResponse.endsWith('```')) {
        cleanedResponse = cleanedResponse.substring(0, cleanedResponse.length - '```'.length)
      }
      cleanedResponse = cleanedResponse.trim()

      if (cleanedResponse) {
        const resp = await db.insert(JsonForms).values({
          jsonform: cleanedResponse,
          createdBy: user?.primaryEmailAddress.emailAddress,
          createdAt: moment().format('DD/MM/yyyy'),
        }).returning({ id: JsonForms.id })
       const updateCredit = async () => {
        const email= user?.primaryEmailAddress.emailAddress;
        const delta=(appUser>0)?appUser-1:0;
  const res = await fetch('/api/update-credit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({email, delta }),
  })

  const data = await res.json()
  if (data.success) {
    console.log('Updated credit:', data.newCredit)
    setUpdate(!update);
  } else {
    console.error('Failed to update credit:', data.error)
  }
}
updateCredit();
        console.log("new form id: ", resp[0].id)
        if (resp[0].id) {
          router.push('/edit-style/' + resp[0].id)
          toast.success('Form Genrated');
        }
      }
     }else{
      
       toast.error(`Buy Credits .your credits are over`);
       router.push('/dashboard/upgrades');
     
     }
    } catch (err) {
      console.error("Error generating form:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <Button onClick={() => setOpendailog(true)} className='bg-indigo-600 text-white hover:bg-indigo-700'>
        + Create Form
      </Button>

      <Dialog open={opendailog} onOpenChange={setOpendailog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Form</DialogTitle>
            <DialogDescription>
              Describe your form requirements and fields.
            </DialogDescription>
          </DialogHeader>

          <Textarea
            className="my-2"
            onChange={(e) => setUserInput(e.target.value)}
            placeholder="Describe your form in detail"
          />
          <div className='flex gap-2 my-3 justify-end'>
            <Button
              className='bg-indigo-600 text-white hover:bg-indigo-700'
              disabled={loading}
              onClick={genrateForm}
            >
              {loading ? <Loader2 className='animate-spin w-4 h-4' /> : 'Create'}
            </Button>
            <Button onClick={() => setOpendailog(false)}>Cancel</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default CreateForm
