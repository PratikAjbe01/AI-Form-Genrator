import React from 'react'
import Sidebar from './_components/Sidebar'

function Dashlayout({children}) {
  return (
    <div>
        <div className='md:w-64 fixed'><Sidebar/></div>
   
        <div className='md:ml-64'>{children}</div>
    </div>
  )
}

export default Dashlayout
