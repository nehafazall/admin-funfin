import { useQueryData } from "./useQueryData"
import { useMutationData } from "./useMutation"
import syllabusSchema, { syllabusSchemaType } from "@/schema/syllabusSchema"
import useZodForm from "./useZodForm"
import { useSession } from "next-auth/react"
import { useEffect } from "react"
import { toast } from "sonner"
import { createSyllabus, deleteSyllabus, getSyllabuses, updateSyllabus } from "@/api/syllabus"
import { ISyllabus } from "@/types/ISyllabus"
import { useSearchParams } from "next/navigation"

export const useSyllabus = (courseId: string) => {
    const { data: session, status } = useSession();

    useEffect(() => {
        if (status === "unauthenticated") toast.error("Unauthorized");
    }, [status]);

    const searchParams = useSearchParams();
    const skip = Number(searchParams.get("skip")) || 0;
    const limit = Number(searchParams.get("limit")) || 10;

    const { data, isPending, isFetched, error } = useQueryData(
        ["syllabuses", courseId, skip, limit],
        () => getSyllabuses(courseId, session?.user?.token, skip, limit),
        { enabled: !!courseId && !!session?.user?.token }
    )

    useEffect(() => {
        if (error) toast.error((error as Error).message);
    }, [error])

    const syllabuses = ((data as any)?.syllabuses || (data as any)?.data) as ISyllabus[] || []
    const total = (data as any)?.total as number | undefined
    return { data, isPending, isFetched, syllabuses, total }
}

export const useCreateSyllabus = (courseId: string) => {
    const { data: session, status } = useSession();

    useEffect(() => {
        if (status === "unauthenticated") toast.error("Unauthorized");
    }, [status]);

    const defaultValues: syllabusSchemaType = { courseId, title: "", moduleLabel: "", coverImage: undefined }
    const { mutate, isPending, isSuccess } = useMutationData(
        ["createSyllabus"],
        (data: syllabusSchemaType) => createSyllabus(data, session?.user?.token),
        `syllabuses-${courseId}`
    )
    const { form, onFormSubmit } = useZodForm(syllabusSchema, mutate, defaultValues)

    return { form, isPending, onFormSubmit, isSuccess }
}

export const useEditSyllabus = (data: ISyllabus) => {
    const { data: session, status } = useSession();

    useEffect(() => {
        if (status === "unauthenticated") toast.error("Unauthorized");
    }, [status]);

    const { mutate, isPending, isSuccess } = useMutationData(
        ["editSyllabus"],
        (values: Partial<syllabusSchemaType>) => updateSyllabus(data._id, values, session?.user?.token),
        `syllabuses-${data.courseId}`,
        () => toast.success("Syllabus updated successfully")
    )
    const { form, onFormSubmit } = useZodForm(syllabusSchema, mutate, data as any)

    useEffect(() => {
        form.reset(data as any)
    }, [data])

    return { form, isPending, onFormSubmit, isSuccess }
}

export const useDeleteSyllabus = (courseId: string) => {
    const { data: session, status } = useSession();

    useEffect(() => {
        if (status === "unauthenticated") toast.error("Unauthorized");
    }, [status]);

    const { mutate, isPending, isSuccess } = useMutationData(
        ["deleteSyllabus"],
        (id: string) => deleteSyllabus(id, session?.user?.token),
        `syllabuses-${courseId}`
    )
    return { mutate, isPending, isSuccess }
}
