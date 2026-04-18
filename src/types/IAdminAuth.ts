export type AdminRole = "superadmin" | "admin" | "mentor" | "counsilor"

export interface AdminProfile {
  id: string
  fullName: string
  email: string
  role: AdminRole
  isActive: boolean
}

export interface AdminProfileResponse {
  admin: AdminProfile
}

export interface AdminBootstrapInput {
  fullName: string
  email: string
  password: string
  isActive?: boolean
}

export interface AdminBootstrapResponse {
  message: string
  admin: AdminProfile
}
