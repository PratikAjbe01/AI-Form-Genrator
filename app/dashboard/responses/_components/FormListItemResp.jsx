'use client'
import { Button } from '@/components/ui/button'
import { db } from '@/configs'
import { userResponses } from '@/configs/Schema'

import { eq } from 'drizzle-orm'
import { Loader2 } from 'lucide-react'
import React, { useEffect, useState } from 'react'
import * as XLSX from 'xlsx';
function FormListItemResp({jsonForm,formRecord}) {

    const [loading,setLoading]=useState(false);
    const [response,setresponse]=useState(45);
    useEffect(()=>{
const getresp=async()=>{
     const result=await db.select().from(userResponses)
        .where(eq(userResponses.formRef,formRecord.id));
    console.log('result',result);
        console.log(result.length);
        setresponse(result.length);
}
getresp();
    },[])

    const ExportData=async()=>{
        let jsonData=[];
        setLoading(true);
        const result=await db.select().from(userResponses)
        .where(eq(userResponses.formRef,formRecord.id));

    
        if(result)
        { 
            result.forEach((item)=>{
                const jsonItem=JSON.parse(item.jsonResponse);
                jsonData.push(jsonItem);
            })
            setLoading(false);
        }
        console.log(jsonData);
        exportToExcel(jsonData)
    }

    
    /**
     * Convert Json to Excel and then Donwload it
     */
    const exportToExcel=(jsonData)=>{
        const worksheet = XLSX.utils.json_to_sheet(jsonData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sheet1");
       
        XLSX.writeFile(workbook, jsonForm?.formTitle+".xlsx");
    }

  return (
    <div className='border shadow-sm rounded-lg p-4 my-5'>
       
        <h2 className='text-lg text-black'>{jsonForm?.form_title}</h2>
        <h2 className='text-sm text-gray-500'>{jsonForm?.form_description}</h2>
        <hr className='my-4'></hr>
        <div className='flex justify-between items-center'>
            <h2 className='text-sm'><strong>{response}</strong> Responses</h2>
            <Button className="bg-indigo-600 hover:bg-indigo-700" size="sm"
            onClick={()=>ExportData()}
            disabled={loading}
            >
                {loading?<Loader2 className='animate-spin' />:'Export' }
                </Button>
        </div>
    </div>
  )
}

export default FormListItemResp