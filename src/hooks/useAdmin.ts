import { useQueryData } from "./useQueryData"
import { useMutationData } from "./useMutation"
import adminSchema, { adminSchemaType } from "@/schema/adminSchema"
import useZodForm from "./useZodForm"
import { useSession } from "next-auth/react"
import { useEffect } from "react"
import { toast } from "sonner"
import { createAdmin, deleteAdmin, getAdmins, updateAdmin } from "@/api/admin"
import { IUser } from "@/types/IUser"
import { useSearchParams } from "next/navigation"

const defaultValues: adminSchemaType = {
    fullName: "",
    email: "",
    password: "",
    role: "admin",
    isActive: true,
}

export const useUsers = () => {
    const { data: session, status } = useSession();
    if (status === "unauthenticated") throw new Error("Unauthorized");

    const searchParams = useSearchParams();
    const skip = Number(searchParams.get("skip")) || 0;
    const limit = Number(searchParams.get("limit")) || 10;

    const { data, isPending, isFetched, error } = useQueryData(
        ["users", skip, limit],
        () => getAdmins(session?.user?.token, skip, limit),
        { enabled: !!session?.user?.token }
    )
    useEffect(() => {
        if (error) toast.error((error as Error).message);
    }, [error])

    const users = ((data as any)?.admins || (data as any)?.data) as IUser[] || []
    const total = (data as any)?.total as number | undefined
    return { data, isPending, isFetched, users, total }
}

export const useCreateUser = () => {
    const { data: session, status } = useSession();
    if (status === "unauthenticated") throw new Error("Unauthorized");

    const { mutate, isPending, isSuccess } = useMutationData(
        ["createUser"],
        (data: adminSchemaType) => createAdmin(data, session?.user?.token),
        "users"
    )
    const { form, onFormSubmit } = useZodForm(adminSchema, mutate, defaultValues)

    return { form, isPending, onFormSubmit, isSuccess }
}

export const useEditUser = (data: IUser) => {
    const { data: session, status } = useSession();
    if (status === "unauthenticated") throw new Error("Unauthorized");

    const { mutate, isPending, isSuccess } = useMutationData(
        ["editUser"],
        (values: Partial<adminSchemaType>) => updateAdmin(data._id, values, session?.user?.token),
        "users",
        () => toast.success("Admin updated successfully")
    )
    const { form, onFormSubmit } = useZodForm(adminSchema, mutate, data as any)

    useEffect(() => {
        form.reset(data as any)
    }, [data])

    return { form, isPending, onFormSubmit, isSuccess }
}

export const useDeleteUser = () => {
    const { data: session, status } = useSession();
    if (status === "unauthenticated") throw new Error("Unauthorized");

    const { mutate, isPending, isSuccess } = useMutationData(
        ["deleteUser"],
        (id: string) => deleteAdmin(id, session?.user?.token),
        "users"
    )
    return { mutate, isPending, isSuccess }
}
