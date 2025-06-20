'use client'
import { Button } from '@/components/ui/button'
import { SignUpButton, UserButton, useUser } from '@clerk/nextjs'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React from 'react'
import { useAppUser } from '../_context/UserContext'

function Header() {
 const { appUser, loading } = useAppUser()
  const {isSignedIn}=useUser();
  const path=usePathname();
  return !path.includes('aiform')&&(
    <div className='pt-3 pl-10 pr-10 pb-3 border-b shadow-sm'>
   <div className='flex items-center justify-between cursor-pointer'>
<Link href={'/'}>    <Image src={'/logo1.jpg'} width={55} height={55} alt='logo'/></Link>
{isSignedIn?<div className='flex items-center justify-between gap-5'>
<strong>{appUser}</strong>
  <Link href={'/dashboard'}>
    <Button variant={'outline'} className='border-indigo-600 text-indigo-700 ' >Dashboard</Button>
 </Link>
 <UserButton/>
 

</div>:<div>
 <SignUpButton path='/sign-up'>
    <Button className='bg-indigo-600 hover:bg-indigo-700' >Get Started</Button>
    </SignUpButton>
  </div>}

   </div>
    </div>
  )
}

export default Header
