
'use client'
import React from 'react'
import CreateForm from './_components/CreateForm'
import FormList from './_components/FormList'

function page() {
  return (
    <div className='p-10'>
<h2 className='font-bold text-3xl flex items-center justify-between'>Dashboard
  <CreateForm/>
</h2>
{/* Form List of User */}
<FormList/>
    </div>
  )
}

export default page
