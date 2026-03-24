// Main course feature removed - not supported by new backend
export const useMainCourse = (..._args: any[]) => { return { data: null, isPending: false, isFetched: true, courses: [] } }
export const useCreateMainCourse = (..._args: any[]) => { return { form: null, isPending: false, onFormSubmit: () => {}, isSuccess: false, types: [] } }
export const useEditMainCourse = (..._args: any[]) => { return { form: null, isPending: false, onFormSubmit: () => {}, isSuccess: false, types: [] } }
export const useDeleteMainCourse = (..._args: any[]) => { return { mutate: () => {}, isPending: false, isSuccess: false } }
