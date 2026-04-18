/**
 * Custom hook for managing async API operations with loading and error states
 * Provides consistent error handling and logging across the application
 */

import { useCallback, useState } from "react"
import { toast } from "sonner"

export interface UseAsyncOptions {
  onSuccess?: (data: unknown) => void | Promise<void>
  onError?: (error: Error) => void | Promise<void>
  showSuccessToast?: boolean
  showErrorToast?: boolean
  successMessage?: string
  errorMessage?: string
}

export interface UseAsyncState<T> {
  data: T | null
  loading: boolean
  error: Error | null
}

/**
 * Hook for handling async operations with loading and error states
 * @template T - The type of data returned by the async function
 * @param asyncFn - The async function to execute
 * @param options - Configuration options for the hook
 * @returns Object with data, loading, error states and execute function
 */
export function useAsync<T>(
  asyncFn: () => Promise<T>,
  options: UseAsyncOptions = {}
) {
  const {
    onSuccess,
    onError,
    showSuccessToast = false,
    showErrorToast = true,
    successMessage = "Operation completed successfully",
    errorMessage = "An error occurred",
  } = options

  const [state, setState] = useState<UseAsyncState<T>>({
    data: null,
    loading: false,
    error: null,
  })

  const execute = useCallback(async () => {
    setState({ data: null, loading: true, error: null })

    try {
      const result = await asyncFn()
      setState({ data: result, loading: false, error: null })

      if (showSuccessToast) {
        toast.success(successMessage)
      }

      if (onSuccess) {
        await onSuccess(result)
      }

      return result
    } catch (err) {
      const error = err instanceof Error ? err : new Error(String(err))
      setState({ data: null, loading: false, error })

      if (showErrorToast) {
        toast.error(error.message || errorMessage)
      }

      if (onError) {
        await onError(error)
      }

      throw error
    }
  }, [asyncFn, onSuccess, onError, showSuccessToast, showErrorToast, successMessage, errorMessage])

  const reset = useCallback(() => {
    setState({ data: null, loading: false, error: null })
  }, [])

  return {
    ...state,
    execute,
    reset,
  }
}

/**
 * Hook for handling API calls with session token
 * Ensures proper auth handling and error messages
 */
export function useApiCall<T>(
  apiFactory: (token: string) => Promise<T>,
  token: string | undefined,
  options: UseAsyncOptions = {}
) {
  const asyncFn = useCallback(async () => {
    if (!token) {
      throw new Error("Authentication required")
    }
    return apiFactory(token)
  }, [apiFactory, token])

  return useAsync(asyncFn, options)
}
