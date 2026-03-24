// Bookings feature removed - not supported by new backend
export const useBookings = (..._args: any[]) => { return { data: null, isPending: false, isFetched: true } }
export const useDeleteMultipleBookings = (..._args: any[]) => { return { mutate: () => {}, isPending: false, isSuccess: false, ids: [], setIds: () => {} } }
