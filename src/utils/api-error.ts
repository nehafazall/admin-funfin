/**
 * API Error Handling Utilities
 * Provides consistent error parsing and formatting across API calls
 */

import { ERROR_MESSAGES } from "@/constants/messages"

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status?: number,
    public readonly data?: unknown
  ) {
    super(message)
    this.name = "ApiError"
  }
}

/**
 * Parse error from axios or native fetch errors
 * Returns a user-friendly error message
 */
export function parseApiError(error: unknown): string {
  // Handle axios errors
  if (error && typeof error === "object" && "response" in error) {
    const axiosError = error as any
    if (axiosError.response?.data?.message) {
      return axiosError.response.data.message
    }
    if (axiosError.response?.status === 401) {
      return ERROR_MESSAGES.SESSION_EXPIRED
    }
    if (axiosError.response?.status === 403) {
      return ERROR_MESSAGES.UNAUTHORIZED
    }
    if (axiosError.response?.status) {
      return ERROR_MESSAGES.API_ERROR(axiosError.response.status)
    }
  }

  // Handle network errors
  if (error && typeof error === "object" && "message" in error) {
    const err = error as any
    if (err.message?.includes("Network")) {
      return ERROR_MESSAGES.NETWORK_ERROR
    }
    if (err.message) {
      return err.message
    }
  }

  // Handle Error objects
  if (error instanceof Error) {
    return error.message
  }

  // Handle string errors
  if (typeof error === "string") {
    return error
  }

  return ERROR_MESSAGES.UNKNOWN_ERROR
}

/**
 * Validate api response structure
 */
export function validateApiResponse<T>(
  data: unknown,
  requiredFields: string[]
): data is Record<string, T> {
  if (!data || typeof data !== "object") {
    return false
  }

  return requiredFields.every((field) => field in data)
}

/**
 * Type guard for error response
 */
export function isErrorResponse(data: unknown): data is { message?: string; error?: string } {
  return (
    typeof data === "object" &&
    data !== null &&
    ("message" in data || "error" in data)
  )
}
