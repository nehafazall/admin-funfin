// Students feature removed - not supported by new backend
export const useStudents = (..._args: any[]) => { return { data: null, isPending: false, isFetched: true } }
export const useCreateStudent = (..._args: any[]) => { return { form: null, isPending: false, onFormSubmit: () => {}, isSuccess: false } }
export const useEditStudent = (..._args: any[]) => { return { form: null, isPending: false, onFormSubmit: () => {}, isSuccess: false } }
export const useDeleteStudent = (..._args: any[]) => { return { mutate: () => {}, isPending: false, isSuccess: false } }
