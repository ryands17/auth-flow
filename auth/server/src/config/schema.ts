import * as z from 'zod'

export const SignupPayload = z.object({
  name: z.string().nullable(),
  email: z.string(),
  password: z.string(),
})

export type SignupBody = z.infer<typeof SignupPayload>

export const LoginPayload = z.object({
  email: z.string(),
  password: z.string(),
})

export type LoginBody = z.infer<typeof LoginPayload>
