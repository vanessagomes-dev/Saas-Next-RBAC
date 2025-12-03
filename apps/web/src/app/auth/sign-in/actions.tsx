"use server";

import { HTTPError } from "ky";
import { z } from "zod";

import { signInWithPassword } from "@/http/sign-in-with-password";

type FieldErrors = {
  email?: string[] | undefined
  password?: string[] | undefined
}

// Define o tipo de retorno completo da Server Action
export type SignInActionState = {
  success: boolean
  message: string | null
  errors: FieldErrors | null
}

const signInSchema = z.object({
  email: z
    .string()
    .email({ message: "Please, provide a valid e-mail address." }),
  password: z.string().min(1, { message: "Please, provide your password." }),
});

export async function signInWithEmailAndPassword(_: SignInActionState | null, data: FormData,

): Promise<SignInActionState> {
  const result = signInSchema.safeParse(Object.fromEntries(data));

  if (!result.success) {
    const errors = result.error.flatten().fieldErrors;

    return { success: false, message: null, errors };
  }

  const { email, password } = result.data;

  try {
    const { token } = await signInWithPassword({
      email,
      password,
    });
    console.log(token);

    // Retorno de Sucesso (sem erros de campo ou mensagem de erro global)
    return { success: true, message: 'Login realizado com sucesso!', errors: null };
    
  } catch (err) {
    if (err instanceof HTTPError) {
      const { message } = await err.response.json();
      return { success: false, message, errors: null };
    }
    console.error(err);
    return {
      success: false,
      message: "Unexpected error, try again in a few minutes.",
      errors: null,
    };
  }
}
