// IUser is kept for compatibility. Use IAdmin for admin panel entities.
export interface IUser {
    _id: string;
    fullName: string;
    email: string;
    role: "superadmin" | "admin" | "mentor" | "counsilor";
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}

// Alias for clarity in admin panel
export type IAdmin = IUser;
