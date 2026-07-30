"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import Link from "next/link"
import { Anchor, Loader2, ArrowLeft, MailCheck } from "lucide-react"

const forgotSchema = z.object({
  email: z.string().email("Please enter a valid email address."),
})

type ForgotFormValues = z.infer<typeof forgotSchema>

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotFormValues>({
    resolver: zodResolver(forgotSchema),
  })

  const onSubmit = async (data: ForgotFormValues) => {
    setIsLoading(true)
    
    // Simulate API call to send reset email (To be integrated with Resend in Phase 3)
    await new Promise((resolve) => setTimeout(resolve, 1500))
    console.log(`[Mock] Password reset link sent to: ${data.email}`)
    
    setIsLoading(false)
    setIsSuccess(true)
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      
      <div className="absolute top-0 left-0 w-full h-96 bg-slate-950 -skew-y-6 origin-top-left -z-10" />

      <div className="sm:mx-auto sm:w-full sm:max-w-md animate-in fade-in slide-in-from-bottom-8 duration-700">
        <div className="flex justify-center mb-6">
          <div className="h-16 w-16 bg-white rounded-2xl shadow-xl flex items-center justify-center border border-slate-100">
            <Anchor className="h-8 w-8 text-slate-950" />
          </div>
        </div>
        <h2 className="mt-2 text-center text-3xl font-bold tracking-tight text-white sm:text-slate-900">
          Reset Password
        </h2>
        <p className="mt-2 text-center text-sm text-slate-300 sm:text-slate-600">
          Enter your admin email to receive a reset link
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150 fill-mode-both">
        <div className="bg-white py-10 px-4 shadow-2xl sm:rounded-3xl sm:px-10 border border-slate-100">
          
          {isSuccess ? (
            <div className="flex flex-col items-center text-center animate-in zoom-in-95 duration-500">
              <div className="h-16 w-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
                <MailCheck className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Check your email</h3>
              <p className="text-slate-500 mb-8">
                If an account exists for that email, we have sent password reset instructions.
              </p>
              <Link
                href="/login"
                className="w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-slate-950 hover:bg-slate-800 transition-all gap-2"
              >
                Return to Login
              </Link>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Email address
                </label>
                <div>
                  <input
                    {...register("email")}
                    type="email"
                    autoComplete="email"
                    disabled={isLoading}
                    className="appearance-none block w-full px-4 py-3 border border-slate-200 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 sm:text-sm transition-colors bg-slate-50 disabled:opacity-50"
                    placeholder="admin@chicagoyachts.com"
                  />
                  {errors.email && (
                    <p className="mt-2 text-sm text-red-600 font-medium">{errors.email.message}</p>
                  )}
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-slate-950 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-900 transition-all disabled:opacity-70 gap-2"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="animate-spin h-5 w-5" /> Sending...
                    </>
                  ) : (
                    "Send Reset Link"
                  )}
                </button>
              </div>
              
              <div className="text-center mt-4">
                <Link href="/login" className="text-sm font-semibold text-slate-500 hover:text-slate-900 transition-colors inline-flex items-center gap-1">
                  <ArrowLeft className="h-4 w-4" /> Back to Login
                </Link>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  )
}
