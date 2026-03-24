import { MutationFunction, MutationKey, useMutation, useMutationState, useQueryClient } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { toast } from "sonner"

export const useMutationData = (mutationKey: MutationKey,
    mutationFn: MutationFunction<any, any>,
    queryKey?: string,
    onSuccess?: (data: any) => void
) => {
    const client = useQueryClient()
    const { mutate, isPending, isSuccess, error } = useMutation({
        mutationKey,
        mutationFn,
        onError(error) {
            console.log(error,'error')
            const err = (error as AxiosError)
            toast.error((err.response?.data as { message: string })?.message as string)
        },
        onSuccess(data) {
            console.log(data,"dataaaaa , onSuccess",queryKey)
            // if (queryKey) client.invalidateQueries({ queryKey: [queryKey] as unknown as readonly unknown[] })
            if (onSuccess) onSuccess(data);
            if (data.message) toast.success(data.message)
        },
        onSettled: async () => {
            // console.log("onSettled")
            return await client.invalidateQueries({ queryKey: [queryKey], exact: false })
        }
    })
    return { mutate, isPending, isSuccess, error }
}


export const useMutationDataState = (mutationKey: MutationKey) => {
    const data = useMutationState({
        filters: {
            mutationKey
        },
        select(mutation) {
            return {
                variables: mutation.state.variables as any,
                status: mutation.state.status,
            };
        },
    })
    const latestVaribales = data[data.length - 1];
    return { latestVaribales }
}
