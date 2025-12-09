"use client"

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { useRouter } from "next/navigation"
import supabase from "@/lib/supabase/client"
import type { LoginFormData, SignupFormData } from "@/lib/schemas/auth"
import toast from "react-hot-toast"

export function useAuth() {
  const queryClient = useQueryClient()
  const router = useRouter()

  const { data: user, isLoading } = useQuery({
    queryKey: ["user"],
    queryFn: async () => {
      const { data } = await supabase.auth.getUser()
      return data.user
    },
  })

  const loginMutation = useMutation({
    mutationFn: async (data: LoginFormData) => {
      const { error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      })
      if (error) throw new Error("Podane dane są błędne.")
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] })
      router.push("/dashboard")
      router.refresh()
    },
  })

  const signupMutation = useMutation({
    mutationFn: async (data: SignupFormData) => {
      const { error } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          emailRedirectTo: process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL || `${window.location.origin}/dashboard`,
        },
      })
      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user"] })
    },
  })

  const logoutMutation = useMutation({
    mutationFn: async () => {
      const { error } = await supabase.auth.signOut()
      if (error) throw error
    },
    onSuccess: () => {
      toast.success("Wylogowano pomyślnie")
      queryClient.clear()
      router.push("/")
      router.refresh()
    },
  })

  return {
    user,
    isLoading,
    login: loginMutation.mutateAsync,
    signup: signupMutation.mutateAsync,
    logout: logoutMutation.mutateAsync,
    isLoggingIn: loginMutation.isPending,
    isSigningUp: signupMutation.isPending,
    isLoggingOut: logoutMutation.isPending,
    loginError: loginMutation.error,
    signupError: signupMutation.error,
  }
}
