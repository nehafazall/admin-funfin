"use client";
import { useSession } from "next-auth/react";
import PageContainer from "@/components/layout/page-container";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { MdClass, MdPeople } from "react-icons/md";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export default function Page() {
  const { data: session } = useSession();
  const role = session?.user?.role;

  return (
    <PageContainer scrollable={true}>
      <div className="flex flex-1 flex-col space-y-6">
        <div className="flex px-2 py-2 items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">
            Hi, <span className="text-primary">{session?.user?.name}</span>{" "}
            welcome back 👋
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(role === "superadmin" || role === "admin") && (
            <Card className="bg-gradient-to-t from-primary/10 to-muted-foreground/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MdClass className="w-5 h-5" /> Courses
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm mb-4">
                  Manage your LMS courses, syllabuses and topics.
                </p>
                <Link
                  href="/admin/courses"
                  className={cn(buttonVariants({ size: "sm" }))}
                >
                  Go to Courses →
                </Link>
              </CardContent>
            </Card>
          )}

          {role === "superadmin" && (
            <Card className="bg-gradient-to-t from-primary/10 to-muted-foreground/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MdPeople className="w-5 h-5" /> Admins
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm mb-4">
                  Manage admin users, roles and access.
                </p>
                <Link
                  href="/admin/admins"
                  className={cn(buttonVariants({ size: "sm" }))}
                >
                  Go to Admins →
                </Link>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </PageContainer>
  );
}
