"use client"

import * as React from "react"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { Input } from "../ui/input"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldLabel,
} from "@/components/ui/field"
import { Button } from "../ui/button"
import Link from "next/link"
import { FaGithub, FaGoogle } from "react-icons/fa"
import clsx from "clsx"
import { handleGithubSignIn, handleGoogleSignIn } from "@/app/actions/auth"

const formSchema = z.object({
  email: z
    .string()
    .email(),
  password: z
    .string()
    .min(4, "Password must be at least 4 characters"),
})

export default function LoginForm() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  })

  function onSubmit(data: z.infer<typeof formSchema>) {}

  return (
    <div className="w-96">
      <form id="login-form" onSubmit={form.handleSubmit(onSubmit)}>
        <Controller 
          name="email"
          control={form.control}
          render={({ field, fieldState}) => (
            <Field data-invalid={fieldState.invalid} className="mt-4">
              <FieldLabel htmlFor="email">Email</FieldLabel>
              <Input 
                {...field} 
                id="email" 
                type="text" 
                autoComplete="off" 
                placeholder="you@gmail.com" 
                className={clsx(
                  fieldState.invalid && "border-red-500 focus:border-red-500"
                )}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Controller 
          name="password"
          control={form.control}
          render={({ field, fieldState}) => (
            <Field data-invalid={fieldState.invalid} className="mt-4">
              <FieldLabel htmlFor="password">Password</FieldLabel>
              <Input 
                {...field} 
                id="password" 
                type="password" 
                autoComplete="off" 
                placeholder="••••••••" 
                className={clsx(
                  fieldState.invalid && "border-red-500 focus:border-red-500"
                )}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </form>
      <div className="text-center mt-4">
        <Link href="/forget-password" className="text-purple-400 text-center text-sm">
          Forgot password?
        </Link>
      </div>
      <Button
       className="w-full bg-zinc-900 hover:bg-zinc-600 text-white text-bold border border-purple-300 mt-6 cursor-pointer" 
       style={{ boxShadow: '0 0 25px rgba(168, 85, 247, 0.5)'}}
       type="submit" 
       form="login-form"
      >
        Sign in
      </Button>
      <div className="flex items-center gap-3 mt-4">
        <div className="flex-1 h-px bg-zinc-700" />
        <span className="text-zinc-500 text-sm">or continue with</span>
        <div className="flex-1 h-px bg-zinc-700" />
      </div>
      <Button variant="outline" className="w-full mt-4 cursor-pointer">
        <FaGithub /> GitHub
      </Button>
      
      <form action={handleGoogleSignIn}>
        <Button variant="outline" className="w-full mt-4 cursor-pointer">
          <FaGoogle /> Google
        </Button>
      </form>
      <p className="text-zinc-500 text-sm text-center mt-4">
        Don't have an account?{' '}
        <Link href="/register" className="text-purple-400">
          Sign up
        </Link>
      </p>
    </div>
  );
}
