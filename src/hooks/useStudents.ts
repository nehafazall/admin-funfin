"use client";

import { useForm } from "react-hook-form";

export type StudentFormValues = {
  _id?: string;
  name: string;
  email: string;
  code: string;
  buyedCourse?: string;
  isActive: boolean;
  limit: number;
  limitAvailable: number;
};

const defaultValues: StudentFormValues = {
  name: "",
  email: "",
  code: "",
  buyedCourse: "",
  isActive: true,
  limit: 0,
  limitAvailable: 0,
};

export const useStudents = (..._args: any[]) => {
  return { data: null, isPending: false, isFetched: true, students: [] as any[] };
};

export const useCreateStudent = (..._args: any[]) => {
  const form = useForm<StudentFormValues>({ defaultValues });
  const onFormSubmit = form.handleSubmit(() => {});
  return { form, isPending: false, onFormSubmit, isSuccess: false };
};

export const useEditStudent = (data?: Partial<StudentFormValues>) => {
  const form = useForm<StudentFormValues>({
    defaultValues: {
      ...defaultValues,
      ...data,
    },
  });
  const onFormSubmit = form.handleSubmit(() => {});
  return { form, isPending: false, onFormSubmit, isSuccess: false };
};

export const useDeleteStudent = (..._args: any[]) => {
  return { mutate: (_id: string) => {}, isPending: false, isSuccess: false };
};
