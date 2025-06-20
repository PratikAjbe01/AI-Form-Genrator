'use client'
import { db } from '@/configs'
import { JsonForms } from '@/configs/Schema'
import { useUser } from '@clerk/nextjs'
import { and, eq } from 'drizzle-orm'
import { ArrowLeft, Share, SquareArrowUpRight } from 'lucide-react'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import FormUi from '../_components/FormUi'
import Controller from '../_components/Controller'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { RWebShare } from "react-web-share";
function page({params}) {
  const router = useRouter() 
  const {user}=useUser();
  const [JsonForm,setJsonForm]=useState([]);
  const [record,setRecord]=useState([]);
  const [selectTheme,setSelectTheme]=useState('light');
  const [selectedBackground,setselectedBackground]=useState();
  const [selectedStyle,setSlectedStyle]=useState();

  useEffect(() => {
  console.log("Fetched", JsonForm);
}, [JsonForm]);
  useEffect(()=>{
    user&&getFormData();
  },[user])
  const getFormData=async()=>{
    const reuslt=await db.select().from(JsonForms).where(and(eq(JsonForms.id,params?.formId),eq(JsonForms.createdBy,user?.primaryEmailAddress?.emailAddress )))
    console.log('result for id:',reuslt[0].id);

    setRecord(reuslt[0]);
  const parsedForm = JSON.parse(reuslt[0].jsonform);
    setJsonForm(parsedForm);
    setSelectTheme(reuslt[0].theme);
    setselectedBackground(reuslt[0].background);
    console.log(reuslt[0].background);
    
  }
  const updateControllerFields=async(value,columnName)=>{
        const result = await db
          .update(JsonForms)
          .set({
            [columnName]:value,
          })
          .where(
            and(
              eq(JsonForms.id, record.id),
              eq(JsonForms.createdBy,user?.primaryEmailAddress.emailAddress)
            )
          );
          console.log('updated theme');
          
  }
  return (
    <div className='pl-10 pr-10 pt-1'>
  <div className='flex justify-between items-center'>
        <h2 onClick={()=>router.back()} className='flex gap-2 items-center my-5 cursor-pointer hover:font-bold transition-all'>
        <ArrowLeft/>Back
      </h2>
        <div className='flex gap-2'>
<Link href={'/aiform/'+record?.id} target='_blank'>
    <Button className='flex gap-2 bg-indigo-600 hover:bg-indigo-700'><SquareArrowUpRight className='h-5 w-5'/> Live Preview</Button>
    </Link>
    <RWebShare
        data={{
          text: JsonForm?.form_title+" , Build your form in seconds with AI form Builder ",
          url: process.env.NEXT_PUBLIC_BASE_URL+"/aiform/"+record?.id,
          title: JsonForm?.form_title,
        }}
        onClick={() => console.log("shared successfully!")}
      >
    <Button variant="outline" size="sm" className="flex gap-2"> <Share className='h-5 w-5'/> Share</Button>

      </RWebShare>
   
  </div>
  </div>

    <div className='grid grid-cols-1 md:grid-cols-3 gap-5'>
      <div className='p-5 border rounded-lg shadow-md'>
        <Controller 
        selectTheme={(value) => {
              updateControllerFields(value, 'theme')
              setSelectTheme(value)
            }}
            selectedBackground={(value) => {
              updateControllerFields(value, 'background')

              setselectedBackground(value)
            }
            }
             selectedStyle={(value) => {
              setSlectedStyle(value);
              updateControllerFields(value, 'style')
            }}
      /></div>
      <div className='md:col-span-2 border rounded-lg p-5 h-screen flex items-start overflow-y-auto justify-center' style={{backgroundImage:selectedBackground}}>
        <FormUi JsonForm={JsonForm} setJsonForm={setJsonForm} selectedStyle={selectedStyle}  selectTheme={selectTheme} record={record}/>
      </div>
    </div>
    </div>
  )
}

export default page
