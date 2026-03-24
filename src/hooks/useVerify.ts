"use client";

import { useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import AxiosInstance from "@/utils/axios";
import { ADMIN_AUTH_URL } from "@/constants/api";

/** How often to ping the backend while the app is open. */
const VERIFY_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes

/**
 * Proactively verifies the backend token on every admin page.
 * - Signs out immediately if the session has no token (missing / corrupted session).
 * - Calls GET /api/v1/admin-auth/profile on mount, every 5 minutes,
 *   and whenever the browser tab becomes visible again.
 * - A 401 response from the backend is handled by the Axios response
 *   interceptor which calls signOut automatically.
 */
export const useVerify = () => {
    const { data: session, status } = useSession();

    useEffect(() => {
        // Still loading — do nothing yet
        if (status === "loading") return;

        // Session exists but backend token is missing → sign out immediately
        if (status === "authenticated" && !session?.user?.token) {
            signOut({ callbackUrl: "/auth/login", redirect: true });
            return;
        }

        // Not authenticated — middleware / signOut already handle the redirect
        if (status !== "authenticated") return;

        const token = session.user.token!;

        const verify = async () => {
            try {
                await AxiosInstance(token).get(`${ADMIN_AUTH_URL}/profile`);
            } catch {
                // 401 → Axios interceptor in utils/axios.ts fires signOut automatically.
                // Network errors or 5xx are intentionally ignored to avoid
                // logging the user out due to a temporary backend outage.
            }
        };

        // Check immediately on mount or when the token changes
        verify();

        // Periodic background check
        const interval = setInterval(verify, VERIFY_INTERVAL_MS);

        // Check whenever the user returns to this tab
        const handleVisibilityChange = () => {
            if (document.visibilityState === "visible") verify();
        };
        document.addEventListener("visibilitychange", handleVisibilityChange);

        return () => {
            clearInterval(interval);
            document.removeEventListener("visibilitychange", handleVisibilityChange);
        };
    }, [status, session?.user?.token]);
};
