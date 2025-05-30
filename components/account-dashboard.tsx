"use client"

import { useState } from "react"

interface User {
  id: string
  username: string
  email: string
  referral_code: string
}

export function AccountDashboard({ user }: { user: User }) {
  const [showReferralCode, setShowReferralCode] = useState(false)

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Welcome, {user.username}!</h1>
      <div className="bg-dark-800 p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-semibold mb-4">Account Information</h2>
        <p className="mb-2">
          <strong>Email:</strong> {user.email}
        </p>
        <div className="mt-6">
          <h3 className="text-xl font-semibold mb-2">Referral Program</h3>
          <p className="mb-2">Share your referral code with friends and earn rewards!</p>
          <div className="relative">
            <input
              type="text"
              value={user.referral_code}
              readOnly
              className={`w-full p-2 bg-dark-700 rounded ${showReferralCode ? "" : "filter blur-sm"}`}
            />
            <button
              onClick={() => setShowReferralCode(!showReferralCode)}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-500 text-white px-3 py-1 rounded"
            >
              {showReferralCode ? "Hide" : "Show"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
