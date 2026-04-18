"use client";

import PageContainer from "@/components/layout/page-container";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { getAdminProfile } from "@/api/auth";
import { AdminProfile } from "@/types/IAdminAuth";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { RefreshCcw, ShieldCheck, UserCircle2 } from "lucide-react";

export default function AdminProfilePage() {
  const { data: session } = useSession();
  const token = session?.user?.token as string | undefined;

  const [profile, setProfile] = useState<AdminProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchProfile = useCallback(async (isRefresh = false) => {
    if (!token) return;
    if (isRefresh) setRefreshing(true);
    else setLoading(true);

    try {
      const response = await getAdminProfile(token);
      setProfile(response.admin);
    } catch (error) {
      toast.error((error as Error).message || "Failed to fetch profile");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [token]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return (
    <PageContainer scrollable>
      <div className="flex flex-1 flex-col space-y-4 max-w-4xl w-full">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-3xl font-bold tracking-tight">My Profile</h2>
            <p className="text-sm text-muted-foreground mt-1">
              Read your current admin identity and access role.
            </p>
          </div>
          <Button
            variant="outline"
            onClick={() => fetchProfile(true)}
            disabled={refreshing || !token}
            className="shrink-0"
          >
            <RefreshCcw className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        <Separator />

        <Card className="bg-gradient-to-b from-muted/30 to-background">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <UserCircle2 className="h-5 w-5" />
              Admin Account
            </CardTitle>
            <CardDescription>
              Profile information returned by the backend auth service.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="space-y-3">
                <Skeleton className="h-6 w-64" />
                <Skeleton className="h-6 w-48" />
                <Skeleton className="h-6 w-56" />
                <Skeleton className="h-6 w-28" />
              </div>
            ) : profile ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="rounded-lg border p-4">
                  <p className="text-xs text-muted-foreground">Full Name</p>
                  <p className="font-medium mt-1">{profile.fullName}</p>
                </div>

                <div className="rounded-lg border p-4">
                  <p className="text-xs text-muted-foreground">Email</p>
                  <p className="font-medium mt-1 break-all">{profile.email}</p>
                </div>

                <div className="rounded-lg border p-4">
                  <p className="text-xs text-muted-foreground">Role</p>
                  <div className="mt-1">
                    <Badge className="bg-primary/90 text-primary-foreground capitalize">
                      <ShieldCheck className="h-3 w-3 mr-1" />
                      {profile.role}
                    </Badge>
                  </div>
                </div>

                <div className="rounded-lg border p-4">
                  <p className="text-xs text-muted-foreground">Status</p>
                  <div className="mt-1">
                    <Badge variant={profile.isActive ? "default" : "secondary"}>
                      {profile.isActive ? "Active" : "Inactive"}
                    </Badge>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">No profile data available.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
