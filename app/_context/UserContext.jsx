'use client'

import React, { createContext, useContext, useEffect, useState } from 'react'
import { useUser } from '@clerk/nextjs'

const UserContext = createContext()

export const UserProvider = ({ children }) => {
  const { user, isLoaded } = useUser()
  const [appUser, setAppUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [update,setUpdate]=useState(false);

  useEffect(() => {
    const syncUserWithDB = async () => {
      if (!isLoaded || !user) return

      try {
        const res = await fetch('/api/user', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: user?.primaryEmailAddress?.emailAddress,
          }),
        })

        const data = await res.json()
        setAppUser(data.credit)
        console.log('user saved to database',data.credit);
      } catch (error) {
        console.error('User sync error:', error)
      } finally {
        setLoading(false)
      }
    }

    syncUserWithDB()
  }, [user, isLoaded,update])

  return (
    <UserContext.Provider value={{ appUser, loading ,setUpdate,update}}>
      {children}
    </UserContext.Provider>
  )
}

export const useAppUser = () => useContext(UserContext)
