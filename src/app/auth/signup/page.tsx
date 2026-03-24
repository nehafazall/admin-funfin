import { SignupForm } from "@/components/forms/signUpForm";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { GalleryVerticalEnd } from "lucide-react";

export default function SignUpPage({ className }: { className?: string }) {
  return (
    <div className="flex gridAnim min-h-svh flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
      <div className="w-full max-w-sm">
        <div className={cn("flex flex-col gap-6", className)}>
          <div className="flex flex-col gap-6">
            <div className="flex flex-col items-center gap-2">
              <a href="#" className="flex flex-col items-center gap-2 font-medium">
                <div className="flex h-8 w-8 items-center justify-center rounded-md">
                  <GalleryVerticalEnd className="size-6" />
                </div>
                <span className="sr-only">CLT ADMIN</span>
              </a>
              <h1 className="text-xl font-bold">Welcome to CLT ADMIN</h1>
              <div className="text-center text-sm text-muted-foreground">
                 SignUp Here
              </div>
            </div>

            <SignupForm />

           

            <div className="text-center text-xs text-muted-foreground [&_a]:underline [&_a]:underline-offset-4 hover:[&_a]:text-primary">
              By clicking continue, you agree to our{" "}
              <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>.
            </div>
          </div>

          <div className="text-center text-sm text-muted-foreground mt-4">
            Already have an account?{" "}
            <a href="/auth/login" className="text-primary font-medium hover:underline">
              Login
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
