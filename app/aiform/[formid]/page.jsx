'use client'
import FormUi from '@/app/edit-style/_components/FormUi'
import { db } from '@/configs'
import { JsonForms } from '@/configs/Schema'
import { eq } from 'drizzle-orm'
import Image from 'next/image'
import Link from 'next/link'

import React, { useEffect, useState } from 'react'

function LiveForm({params}) {
  const [record,setRecord]=useState();
  const [jsonform,setJsonForm]=useState([]);
  const [selectedStyle,setSlectedStyle]=useState();

useEffect(()=>{
params&&getFormData()
},[params])
const getFormData=async()=>{
  const result=await db.select().from(JsonForms).where(eq(JsonForms.id,Number(params?.formid)))
  setRecord(result[0]);
  setSlectedStyle(JSON.parse(result[0]?.style));
  setJsonForm(JSON.parse(result[0].jsonform));
  console.log('result',result);
}


  return (
<div className='p-10 flex justify-center items-center' style={{backgroundImage:record?.background}}>
  <FormUi JsonForm={jsonform} setJsonForm={setJsonForm} record={record} selectedStyle={record?.style} editable={false}  selectTheme={record?.theme}/>
  <Link href={process.env.NEXT_PUBLIC_BASE_URL} className='flex gap-2 items-center bg-black text-white px-3 py-1 rounded-full fixed  bottom-5 left-5 cursor-pointer'>
    <Image src={'/icon.png'} alt='icon' height={26} width={26}/>
Build Your Own AI Form
  </Link>
</div>
   
 
  )
}

export default LiveForm
