"use client";

import { useVerify } from "@/hooks/useVerify";

const DashWall = ({ children }: { children: React.ReactNode }) => {
    useVerify();
    return <>{children}</>;
};

export default DashWall;
