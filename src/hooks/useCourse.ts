import { useQueryData } from "./useQueryData"
import { useMutationData } from "./useMutation"
import courseSchema, { courseSchemaType } from "@/schema/courseSchema"
import useZodForm from "./useZodForm"
import { useSession } from "next-auth/react"
import { useEffect } from "react"
import { toast } from "sonner"
import { createCourse, deleteCourse, getCourseById, getCourses, updateCourse } from "@/api/course"
import { ICourse } from "@/types/ICourse"
import { useSearchParams } from "next/navigation"

const defaultValues: courseSchemaType = {
    title: "",
    photo: "",
    description: "",
    duration: "",
    rating: undefined,
    totalModules: undefined,
    isPublished: false,
}

export const useCourse = () => {
    const { data: session, status } = useSession();

    useEffect(() => {
        if (status === "unauthenticated") toast.error("Unauthorized");
    }, [status]);

    const searchParams = useSearchParams();
    const skip = Number(searchParams.get("skip")) || 0;
    const limit = Number(searchParams.get("limit")) || 10;

    const { data, isPending, isFetched, error } = useQueryData(
        ["courses", skip, limit],
        () => getCourses(session?.user?.token, skip, limit),
        { enabled: !!session?.user?.token }
    )

    useEffect(() => {
        if (error) toast.error((error as Error).message);
    }, [error])

    const courses = ((data as any)?.courses || (data as any)?.data) as ICourse[] || []
    const total = (data as any)?.total as number | undefined
    return { data, isPending, isFetched, courses, total }
}

export const useCreateCourse = () => {
    const { data: session, status } = useSession();

    useEffect(() => {
        if (status === "unauthenticated") toast.error("Unauthorized");
    }, [status]);

    const { mutate, isPending, isSuccess } = useMutationData(
        ["createCourse"],
        (data: courseSchemaType) => createCourse(data, session?.user?.token),
        "courses"
    )
    const { form, onFormSubmit } = useZodForm(courseSchema, mutate, defaultValues)

    return { form, isPending, onFormSubmit, isSuccess }
}

export const useEditCourse = (data: courseSchemaType) => {
    const { data: session, status } = useSession();

    useEffect(() => {
        if (status === "unauthenticated") toast.error("Unauthorized");
    }, [status]);

    const { mutate, isPending, isSuccess } = useMutationData(
        ["editCourse"],
        (values: courseSchemaType) => updateCourse(data._id, values, session?.user?.token),
        "courses",
        () => toast.success("Course updated successfully")
    )
    const { form, onFormSubmit } = useZodForm(courseSchema, mutate, data)

    useEffect(() => {
        form.reset(data)
    }, [data, form])

    return { form, isPending, onFormSubmit, isSuccess }
}

export const useCourseById = (id: string) => {
    const { data: session, status } = useSession();

    useEffect(() => {
        if (status === "unauthenticated") toast.error("Unauthorized");
    }, [status]);

    const { data, isPending, error } = useQueryData(
        ["course", id],
        () => getCourseById(id, session?.user?.token),
        { enabled: !!id && !!session?.user?.token }
    );

    useEffect(() => {
        if (error) toast.error((error as Error).message);
    }, [error]);

    const course = (data as any)?.course as ICourse | undefined;
    return { course, isPending };
}

export const useDeleteCourse = () => {
    const { data: session, status } = useSession();

    useEffect(() => {
        if (status === "unauthenticated") toast.error("Unauthorized");
    }, [status]);

    const { mutate, isPending, isSuccess } = useMutationData(
        ["deleteCourse"],
        (id: string) => deleteCourse(id, session?.user?.token),
        "courses"
    )
    return { mutate, isPending, isSuccess }
}
