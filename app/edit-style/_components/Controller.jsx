'use client'
import React, { useState } from 'react'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import Themes from '@/app/_data/Themes'
import GradientBg from '@/app/_data/GradientBg'
import { Button } from '@/components/ui/button'
import Style from '@/app/_data/Style'
function Controller({selectTheme, selectedBackground ,selectedStyle}) {
const [showMore,setShowMore]=useState(6);
  return (
    <div className='my-1'>
{/* //theme selector */}
      <h2>Select Theme</h2>
      <Select onValueChange={(value)=>selectTheme(value)}>
  <SelectTrigger className="w-full">
    <SelectValue placeholder="Theme" />
  </SelectTrigger>
  <SelectContent>
    {
      Themes.map((value,ind)=>(
        <div key={ind}>
    <SelectItem value={value.theme}>
     <div className='flex gap-3'>
       <div className='flex'>
        <div className='h-5 w-5 rounded-l-md'
        style={{backgroundColor:value.primary}}></div>
          <div className='h-5 w-5'
        style={{backgroundColor:value.secondary}}></div>
          <div className='h-5 w-5'
        style={{backgroundColor:value.neutral}}></div>
          <div className='h-5 w-5 rounded-r-md'
        style={{backgroundColor:value.accent}}></div>
  
      </div>
            {value.theme}
     </div>
    </SelectItem>
        </div>

      ))
    }

  
  </SelectContent>
</Select>
{/* //background theme selector */}
<h2 className='mt-8 my-1'>Seclect Background</h2>
<div className='grid grid-cols-3 gap-4'>
  {GradientBg.map((bg,ind)=>(ind<showMore)&&(
<div key={ind} onClick={()=>selectedBackground(bg.gradient)} className='w-full h-[70px] cursor-pointer rounded-lg hover:border border-black flex items-center justify-center text-sm font-medium' style={{background:bg.gradient}}>
{ind==0&&'None'}
</div>
  ))}

</div>
  <Button variant="ghost" onClick={()=>setShowMore(showMore<=6?20:6)} size="sm" className="w-full">{showMore>6?'Show Less':'Show More'}</Button>
 
     <div>
          <label>Style</label>
          <div className='grid grid-cols-3  gap-3'>
            {Style.map((item,index)=>(
                <div key={index}>
              <div className='cursor-pointer hover:border-2 rounded-lg' onClick={()=>selectedStyle(item)}>
                <img src={item.img} width={600} height={80} className='rounded-lg'/>
              
              </div>
                <h2 className='text-center'>{item.name}</h2>
                </div>
            ))}
          </div>
        </div>

    </div>

    // style contoller select
    
  )
}

export default Controller
