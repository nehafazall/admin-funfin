"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import PageContainer from "@/components/layout/page-container";
import { AlertTriangle, RotateCcw } from "lucide-react";
import { useEffect } from "react";

export default function AdminError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Admin Route Error]", error);
  }, [error]);

  return (
    <PageContainer scrollable>
      <div className="flex w-full items-center justify-center py-16">
        <Card className="w-full max-w-xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              Something went wrong
            </CardTitle>
            <CardDescription>
              We captured this page error. You can retry safely.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-md border bg-muted/40 p-3 text-sm text-muted-foreground break-all">
              {error?.message || "Unknown error"}
            </div>
            <Button onClick={reset}>
              <RotateCcw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    </PageContainer>
  );
}
