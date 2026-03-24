// Calendar/bookings feature removed - not supported by new backend
export const useCalander = (..._args: any[]) => {
  return { selectedCourse: null, setSelectedCourse: () => {}, selectedMainCourse: null, setSelectedMainCourse: () => {}, bookings: {}, refetch: () => {}, isPending: false, isFetching: false }
}
