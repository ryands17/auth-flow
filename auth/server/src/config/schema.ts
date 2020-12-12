import * as z from 'zod'
import type { User } from '@prisma/client'

export const SignupPayload = z.object({
  name: z.string().nullable(),
  email: z.string(),
  password: z.string(),
})

export type SignupBody = z.infer<typeof SignupPayload>

export type LoginResponse = {
  user: User
  accessToken: string
}

export const LoginPayload = z.object({
  email: z.string(),
  password: z.string(),
})

export type LoginBody = z.infer<typeof LoginPayload>

export type SignOut = {
  redirect: string
}

export type { User }
