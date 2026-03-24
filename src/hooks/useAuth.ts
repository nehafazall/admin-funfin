"use client";
import loginSchema from "@/schema/loginSchema";
import { login } from "@/api/auth";
import { useMutationData } from "./useMutation";
import useZodForm from "./useZodForm";
import { signIn } from "next-auth/react"
import { useRouter } from "nextjs-toploader/app";

export const useAuth = () => {
  const router = useRouter()
  const { mutate, isPending, error: mutationError, isSuccess } = useMutationData(
    ['login'],
    (data: { email: string; password: string }) => login(data),
    undefined,
    onSubmit
  )
  const form = useZodForm(loginSchema, mutate);
  const { register, onFormSubmit, errors, reset, setValue } = form;

  async function onSubmit(response: { admin: any, token: string }) {
    const admin = response.admin;
    await signIn("credentials", {
      email: admin.email,
      fullName: admin.fullName,
      id: admin.id || admin._id,
      token: response.token,
      role: admin.role,
      redirect: false
    })
    router.push("/admin/dashboard")
  }

  return { register, onFormSubmit, errors, reset, isPending, mutationError, isSuccess, form, setValue }
}

