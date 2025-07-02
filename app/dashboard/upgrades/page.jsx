"use client"
import { toast } from "react-toastify"
import PricingPlan from "@/app/_data/PricingPlan"
import { useUser } from "@clerk/nextjs"
import { useAppUser } from "@/app/_context/UserContext"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Check, Sparkles } from "lucide-react"

function Upgrade() {
  const { user } = useUser()
  const { setUpdate, update } = useAppUser()

  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script")
      script.src = "https://checkout.razorpay.com/v1/checkout.js"
      script.onload = () => resolve(true)
      script.onerror = () => resolve(false)
      document.body.appendChild(script)
    })
  }

  const handlePayment = async (price) => {
    const res = await loadRazorpayScript()

    if (!res) {
      toast.error("Razorpay SDK failed to load")
      return
    }

    const response = await fetch("/api/buy-subscription", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: price }),
    })

    const data = await response.json()
    const { orderId } = data

    const options = {
      key: process.env.NEXT_PUBLIC_RAZORPAY_ID,
      amount: price,
      currency: "INR",
      name: "Ramandeep's App",
      description: "Upgrade Plan",
      order_id: orderId,
      handler: async (response) => {
        try {
          const res = await fetch("/api/update-credit", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              email: user?.primaryEmailAddress?.emailAddress,
              delta: 5,
            }),
          })

          const result = await res.json()
          if (result.success) {
            toast.success("Payment successful & credits updated!")
            setUpdate(!update)
          } else {
            toast.warning("Payment successful, but failed to update credits.")
          }
        } catch (err) {
          toast.error("Payment succeeded, but updating credits failed.")
          console.error(err)
        }
      },
      prefill: {
        email: user?.primaryEmailAddress?.emailAddress || "",
        name: user?.fullName || "User",
      },
      theme: {
        color: "#6366f1",
      },
    }

    const rzp = new window.Razorpay(options)
    rzp.open()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50">
      <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4 mr-2" />
            Upgrade Your Plan
          </div>
          
        </div>

        {/* Pricing Card */}
        <div className="flex justify-center">
          {PricingPlan.map((item, index) => (
            <Card
              key={index}
              className="w-full max-w-md border-2 border-blue-100 hover:border-blue-300 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              <CardContent className="p-3 text-center">
                <div className="mb-8">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Sparkles className="w-8 h-8 text-white" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Premium Plan</h2>
                  <div className="mb-6">
                    <span className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      ₹{(item.price / 100).toFixed(0)}
                    </span>
                    <span className="text-gray-600 ml-2">/5 credits</span>
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  <div className="flex items-center text-left">
                    <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">Get 5 AI Forms</span>
                  </div>
                  <div className="flex items-center text-left">
                    <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">Unlimited Responses</span>
                  </div>
                  <div className="flex items-center text-left">
                    <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">Email Support</span>
                  </div>
                  <div className="flex items-center text-left">
                    <Check className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                    <span className="text-gray-700">Full App Access</span>
                  </div>
                </div>

                <Button
                  onClick={() => handlePayment(item.price)}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 text-lg font-semibold shadow-md hover:shadow-lg transition-all duration-200"
                >
                  Get Started Now
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Upgrade
