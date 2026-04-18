"use client";

import { useForm } from "react-hook-form";

export type MainCourseFormValues = {
  _id?: string;
  name: string;
  description: string;
  image?: string;
};

const defaultValues: MainCourseFormValues = {
  name: "",
  description: "",
  image: "",
};

export const useMainCourse = (..._args: any[]) => {
  return { data: null, isPending: false, isFetched: true, courses: [] as any[] };
};

export const useCreateMainCourse = (..._args: any[]) => {
  const form = useForm<MainCourseFormValues>({ defaultValues });
  const onFormSubmit = form.handleSubmit(() => {});
  return { form, isPending: false, onFormSubmit, isSuccess: false, types: [] as any[] };
};

export const useEditMainCourse = (data?: Partial<MainCourseFormValues>) => {
  const form = useForm<MainCourseFormValues>({
    defaultValues: {
      ...defaultValues,
      ...data,
    },
  });
  const onFormSubmit = form.handleSubmit(() => {});
  return { form, isPending: false, onFormSubmit, isSuccess: false, types: [] as any[] };
};

export const useDeleteMainCourse = (..._args: any[]) => {
  return { mutate: (_id: string) => {}, isPending: false, isSuccess: false };
};
