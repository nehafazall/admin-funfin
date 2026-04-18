"use client";

import { useVerify } from "@/hooks/useVerify";
import { useEffect } from "react";
import { toast } from "sonner";

const DashWall = ({ children }: { children: React.ReactNode }) => {
    useVerify();

    useEffect(() => {
        const onRuntimeError = (event: ErrorEvent) => {
            const message = event.message || "Unexpected runtime error";
            console.error("[Admin Runtime Error]", {
                message,
                source: event.filename,
                line: event.lineno,
                column: event.colno,
                error: event.error,
            });
            toast.error(`Runtime error: ${message}`);
        };

        const onUnhandledRejection = (event: PromiseRejectionEvent) => {
            const reason = event.reason instanceof Error ? event.reason.message : String(event.reason);
            console.error("[Admin Unhandled Rejection]", event.reason);
            toast.error(`Unhandled error: ${reason}`);
        };

        window.addEventListener("error", onRuntimeError);
        window.addEventListener("unhandledrejection", onUnhandledRejection);

        return () => {
            window.removeEventListener("error", onRuntimeError);
            window.removeEventListener("unhandledrejection", onUnhandledRejection);
        };
    }, []);

    return <>{children}</>;
};

export default DashWall;
