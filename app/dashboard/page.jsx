"use client"

import CreateForm from "./_components/CreateForm"
import FormList from "./_components/FormList"

function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-indigo-50/30">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                Dashboard
              </h1>
              <p className="text-gray-600 mt-2">Manage your AI-powered forms</p>
            </div>
            <div className="flex-shrink-0">
              <CreateForm />
            </div>
          </div>
        </div>

        {/* Form List Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 sm:p-6">
          <FormList />
        </div>
      </div>
    </div>
  )
}

export default Page
