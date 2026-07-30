"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import Link from "next/link"
import { Anchor, Loader2, CheckCircle2 } from "lucide-react"

const resetSchema = z.object({
  password: z.string().min(8, "Password must be at least 8 characters."),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
})

type ResetFormValues = z.infer<typeof resetSchema>

export default function ResetPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetFormValues>({
    resolver: zodResolver(resetSchema),
  })

  const onSubmit = async (data: ResetFormValues) => {
    setIsLoading(true)
    
    // Simulate API call to reset password
    await new Promise((resolve) => setTimeout(resolve, 1500))
    console.log(`[Mock] Password successfully reset for token.`)
    
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
          Create New Password
        </h2>
        <p className="mt-2 text-center text-sm text-slate-300 sm:text-slate-600">
          Must be at least 8 characters long
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md animate-in fade-in slide-in-from-bottom-4 duration-700 delay-150 fill-mode-both">
        <div className="bg-white py-10 px-4 shadow-2xl sm:rounded-3xl sm:px-10 border border-slate-100">
          
          {isSuccess ? (
            <div className="flex flex-col items-center text-center animate-in zoom-in-95 duration-500">
              <div className="h-16 w-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">Password Updated</h3>
              <p className="text-slate-500 mb-8">
                Your password has been successfully reset. You can now use it to sign in.
              </p>
              <Link
                href="/login"
                className="w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-xl shadow-md text-sm font-bold text-white bg-slate-950 hover:bg-slate-800 transition-all gap-2"
              >
                Sign In
              </Link>
            </div>
          ) : (
            <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  New Password
                </label>
                <div>
                  <input
                    {...register("password")}
                    type="password"
                    disabled={isLoading}
                    className="appearance-none block w-full px-4 py-3 border border-slate-200 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 sm:text-sm transition-colors bg-slate-50 disabled:opacity-50"
                  />
                  {errors.password && (
                    <p className="mt-2 text-sm text-red-600 font-medium">{errors.password.message}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Confirm Password
                </label>
                <div>
                  <input
                    {...register("confirmPassword")}
                    type="password"
                    disabled={isLoading}
                    className="appearance-none block w-full px-4 py-3 border border-slate-200 rounded-xl shadow-sm placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 sm:text-sm transition-colors bg-slate-50 disabled:opacity-50"
                  />
                  {errors.confirmPassword && (
                    <p className="mt-2 text-sm text-red-600 font-medium">{errors.confirmPassword.message}</p>
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
                      <Loader2 className="animate-spin h-5 w-5" /> Resetting...
                    </>
                  ) : (
                    "Reset Password"
                  )}
                </button>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  )
}
