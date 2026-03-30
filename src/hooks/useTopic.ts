import { useQueryData } from "./useQueryData"
import { useMutationData } from "./useMutation"
import topicSchema, { topicSchemaType } from "@/schema/topicSchema"
import useZodForm from "./useZodForm"
import { useSession } from "next-auth/react"
import { useEffect } from "react"
import { toast } from "sonner"
import { createTopic, deleteTopic, getTopics, updateTopic } from "@/api/topic"
import { ITopic } from "@/types/ITopic"
import { useSearchParams } from "next/navigation"

export const useTopic = (syllabusId: string) => {
    const { data: session, status } = useSession();

    useEffect(() => {
        if (status === "unauthenticated") toast.error("Unauthorized");
    }, [status]);

    const searchParams = useSearchParams();
    const skip = Number(searchParams.get("skip")) || 0;
    const limit = Number(searchParams.get("limit")) || 10;

    const { data, isPending, isFetched, error } = useQueryData(
        ["topics", syllabusId, skip, limit],
        () => getTopics(syllabusId, session?.user?.token, skip, limit),
        { enabled: !!syllabusId && !!session?.user?.token }
    )

    useEffect(() => {
        if (error) toast.error((error as Error).message);
    }, [error])

    const topics = ((data as any)?.topics || (data as any)?.data) as ITopic[] || []
    const total = (data as any)?.total as number | undefined
    return { data, isPending, isFetched, topics, total }
}

export const useCreateTopic = (syllabusId: string, courseId: string) => {
    const { data: session, status } = useSession();

    useEffect(() => {
        if (status === "unauthenticated") toast.error("Unauthorized");
    }, [status]);

    const defaultValues: topicSchemaType = { syllabusId, courseId, title: "", videoUrl: "", overview: "", order: undefined }
    const { mutate, isPending, isSuccess } = useMutationData(
        ["createTopic"],
        (data: topicSchemaType) => createTopic(data, session?.user?.token),
        `topics-${syllabusId}`
    )
    const { form, onFormSubmit,errors } = useZodForm(topicSchema, mutate, defaultValues)
console.log(errors)
    return { form, isPending, onFormSubmit, isSuccess }
}

export const useEditTopic = (data: ITopic) => {
    const { data: session, status } = useSession();

    useEffect(() => {
        if (status === "unauthenticated") toast.error("Unauthorized");
    }, [status]);

    const { mutate, isPending, isSuccess } = useMutationData(
        ["editTopic"],
        (values: Partial<topicSchemaType>) => updateTopic(data.id || data._id, values, session?.user?.token),
        `topics-${data.syllabusId}`,
        () => toast.success("Topic updated successfully")
    )
    const { form, onFormSubmit } = useZodForm(topicSchema, mutate, data as any)

    useEffect(() => {
        form.reset(data as any)
    }, [data])

    return { form, isPending, onFormSubmit, isSuccess }
}

export const useDeleteTopic = (syllabusId: string) => {
    const { data: session, status } = useSession();

    useEffect(() => {
        if (status === "unauthenticated") toast.error("Unauthorized");
    }, [status]);

    const { mutate, isPending, isSuccess } = useMutationData(
        ["deleteTopic"],
        (id: string) => deleteTopic(id, session?.user?.token),
        `topics-${syllabusId}`
    )
    return { mutate, isPending, isSuccess }
}
