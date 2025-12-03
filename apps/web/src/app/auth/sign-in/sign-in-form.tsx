"use client";

import { AlertTriangle, Loader2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useActionState } from "react";
import React from "react"; 

import githubIcon from "@/assets/github-icon.svg";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useFormState } from '@/hooks/use-form-state'

import { signInWithEmailAndPassword, SignInActionState } from "./actions"; 

// Define o estado inicial do formulário (que deve corresponder ao SignInActionState)
const initialState: SignInActionState = {
  success: false, 
  message: null, 
  errors: null,
};

export function SignInForm() {

  // Tivemos que tipar o useActionState para garantir que o TypeScript reconheça as propriedades {errors, message, success}.
  const [{ errors, message, success }, formAction, isPending] = useActionState<
    SignInActionState, 
    FormData
  >(signInWithEmailAndPassword, initialState);

  return (
    <form action={formAction} className="space-y-4">
      
      {/* 2. Feedback Global de Erro (API ou Erro Inesperado) */}
      {success === false && message && (
        <Alert variant="destructive">
          <AlertTriangle className="size-4" />
          <AlertTitle>Sign in failed!</AlertTitle>
          <AlertDescription>
            <p>{message}</p>
          </AlertDescription>
        </Alert>
      )}

      {/* Campo E-mail */}
      <div className="space-y-1">
        <Label htmlFor="email">E-mail</Label>
        <Input name="email" type="email" id="email" />
        {/* 3. Feedback de Erro de Validação (Zod) */}
        {errors?.email && (
          <p className="text-xs font-medium text-red-500 dark:text-red-400">
            {errors.email[0]}
          </p>
        )}
      </div>

      {/* Campo Senha */}
      <div className="space-y-1">
        <Label htmlFor="password">Password</Label>
        <Input name="password" type="password" id="password" />

        {/* 3. Feedback de Erro de Validação (Zod) */}
        {errors?.password && (
          <p className="text-xs font-medium text-red-500 dark:text-red-400">
            {errors.password[0]}
          </p>
        )}

        <Link
          href="/auth/forgot-password"
          className="text-xs font-medium text-foreground hover:underline"
        >
          Forgot your password?
        </Link>
      </div>

      {/* Botão de Submissão (Login) */}
      <Button className="w-full" type="submit" disabled={isPending}>
        {/* 4. Feedback de Loading */}
        {isPending ? (
          <Loader2 className="size-4 animate-spin" />
        ) : (
          "Sign in with e-mail"
        )}
      </Button>

      <Button className="w-full" variant="link" size="sm" asChild>
        <Link href="/auth/sign-up">Create new account</Link>
      </Button>

      <Separator />

      {/* Botão de GitHub */}
      <Button type="submit" className="w-full" variant="outline">
        <Image src={githubIcon} alt="" className="mr-2 size-4 dark:invert" />
        Sign in with GitHub
      </Button>
    </form>
  );
}