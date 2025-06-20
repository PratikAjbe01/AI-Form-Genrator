'use client'

import React from 'react'
import { toast } from 'react-toastify'
import PricingPlan from '@/app/_data/PricingPlan'
import { useUser } from '@clerk/nextjs'
import { useAppUser } from '@/app/_context/UserContext'
function Upgrade() {
  const { user } = useUser()
 const { setUpdate,update} = useAppUser()
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement('script')
      script.src = 'https://checkout.razorpay.com/v1/checkout.js'
      script.onload = () => resolve(true)
      script.onerror = () => resolve(false)
      document.body.appendChild(script)
    })
  }

  const handlePayment = async (price) => {
    const res = await loadRazorpayScript()
    if (!res) {
      toast.error('Razorpay SDK failed to load')
      return
    }

    const response = await fetch('/api/buy-subscription', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: price }),
    })

    const data = await response.json()
    const { orderId } = data

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_ID,
      amount: price,
      currency: 'INR',
      name: "Ramandeep's App",
      description: 'Upgrade Plan',
      order_id: orderId,
      handler: async function (response) {
        try {
          const res = await fetch('/api/update-credit', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: user?.primaryEmailAddress?.emailAddress,
              delta: 5, 
            }),
          })

          const result = await res.json()
          if (result.success) {
            toast.success('Payment successful & credits updated!')
            setUpdate(!update);
          } else {
            toast.warning('Payment successful, but failed to update credits.')
          }
        } catch (err) {
          toast.error('Payment succeeded, but updating credits failed.')
          console.error(err)
        }
      },
      prefill: {
        email: user?.primaryEmailAddress?.emailAddress || '',
        name: user?.fullName || 'User',
      },
      theme: {
        color: '#6366f1',
      },
    }

    const rzp = new window.Razorpay(options)
    rzp.open()
  }

  return (
    <div className='p-10'>
      <div className='mx-auto max-w-3xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8'>
        <div className='flex justify-center items-center'>
          {PricingPlan.map((item, index) => (
            <div
              key={index}
              className='rounded-2xl border p-6 shadow-sm sm:px-8 lg:p-12'
            >
              <div className='text-center'>
                <h2 className='text-lg font-medium text-gray-900'>
                  Subscribe
                </h2>
                <p className='mt-2'>
                  <strong className='text-3xl font-bold text-gray-900'>
                    Rs:{(item.price / 100).toFixed(2)}
                  </strong>
                  <span className='text-sm font-medium text-gray-700'>
                    {' '}
                    /credits
                  </span>
                </p>
              </div>
              <ul className='mt-6 space-y-2'>
                <li className='text-gray-700'>✅ Get 5 AI Forms</li>
                <li className='text-gray-700'>✅ Unlimited Responses</li>
                <li className='text-gray-700'>✅ Email Support</li>
                <li className='text-gray-700'>✅ App Access</li>
              </ul>
              <button
                onClick={() => handlePayment(item.price)}
                className='mt-8 block w-full rounded-full border border-indigo-600 bg-white px-12 py-3 text-sm font-medium text-indigo-600 hover:ring-1 hover:ring-indigo-600'
              >
                Get Started
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Upgrade
