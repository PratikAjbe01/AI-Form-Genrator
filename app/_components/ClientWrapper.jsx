// app/_components/ClientWrapper.jsx
'use client'

import { ToastContainer } from 'react-toastify'


export default function ClientWrapper({ children }) {
  return (
    <>
      {children}
      <ToastContainer position="top-right" autoClose={2000} />
    </>
  )
}
