"use client";

import Link from "next/link";
import { useActionState, useEffect, useState } from "react";

import { AuthForm } from "@/components/auth-form";
import { SubmitButton } from "@/components/submit-button";
import { toast } from "@/components/toast";
import { cn } from "@/lib/utils";
import { type LoginActionState, login } from "../actions";

const roles = [
  {
    id: "citizen",
    label: "नागरिक",
    labelEn: "Citizen",
    icon: "👨‍👩‍👧‍👦",
    description: "Access health services and information",
    color: "bg-blue-500",
  },
  {
    id: "asha",
    label: "आशा कार्यकर्ता",
    labelEn: "ASHA Worker",
    icon: "👩‍⚕️",
    description: "Community health worker portal",
    color: "bg-green-500",
  },
  {
    id: "officer",
    label: "अधिकारी",
    labelEn: "Health Officer",
    icon: "🏥",
    description: "District health management",
    color: "bg-purple-500",
  },
  {
    id: "admin",
    label: "व्यवस्थापक",
    labelEn: "Administrator",
    icon: "⚙️",
    description: "System administration & analytics",
    color: "bg-red-500",
  },
] as const;

export default function Page() {
  const [email, setEmail] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>("citizen");
  const [isSuccessful, setIsSuccessful] = useState(false);

  const [state, formAction] = useActionState<LoginActionState, FormData>(
    login,
    {
      status: "idle",
    }
  );

  useEffect(() => {
    if (state.status === "failed") {
      toast({
        type: "error",
        description: "Invalid credentials!",
      });
    } else if (state.status === "invalid_data") {
      toast({
        type: "error",
        description: "Failed validating your submission!",
      });
    }
    // Note: success case is handled by server-side redirect
  }, [state.status]);

  const handleSubmit = (formData: FormData) => {
    setEmail(formData.get("email") as string);
    formData.append("role", selectedRole);
    formAction(formData);
  };

  const currentRole = roles.find((r) => r.id === selectedRole);

  return (
    <div className="flex min-h-dvh w-screen flex-col items-center justify-start bg-gradient-to-b from-background to-muted/30 px-4 py-8 md:justify-center md:py-0">
      <div className="flex w-full max-w-lg flex-col gap-6 overflow-hidden rounded-2xl bg-background p-6 shadow-xl border">
        {/* Header */}
        <div className="flex flex-col items-center justify-center gap-2 text-center">
          <div className="text-4xl mb-2">🏥</div>
          <h1 className="font-bold text-2xl dark:text-zinc-50">
            Arogya Mitra
          </h1>
          <p className="text-muted-foreground text-sm">
            Maharashtra Rural Health Platform
          </p>
        </div>

        {/* Role Selection */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-muted-foreground">
            Select Your Role / आपली भूमिका निवडा
          </label>
          <div className="grid grid-cols-2 gap-3">
            {roles.map((role) => (
              <button
                key={role.id}
                type="button"
                onClick={() => setSelectedRole(role.id)}
                className={cn(
                  "flex flex-col items-center gap-2 rounded-xl border-2 p-4 transition-all hover:shadow-md",
                  selectedRole === role.id
                    ? "border-primary bg-primary/5 shadow-md"
                    : "border-muted hover:border-muted-foreground/30"
                )}
              >
                <span className="text-2xl">{role.icon}</span>
                <div className="flex flex-col items-center">
                  <span className="font-medium text-sm">{role.labelEn}</span>
                  <span className="text-xs text-muted-foreground">
                    {role.label}
                  </span>
                </div>
              </button>
            ))}
          </div>
          {currentRole && (
            <p className="text-xs text-center text-muted-foreground">
              {currentRole.description}
            </p>
          )}
        </div>

        {/* Login Form */}
        <div className="space-y-4">
          <div className="flex flex-col items-center gap-1">
            <h3 className="font-semibold text-lg dark:text-zinc-50">
              Sign In as {currentRole?.labelEn}
            </h3>
            <p className="text-muted-foreground text-sm">
              Use your email and password
            </p>
          </div>
          
          <AuthForm action={handleSubmit} defaultEmail={email}>
            <SubmitButton isSuccessful={isSuccessful}>
              Sign in as {currentRole?.labelEn}
            </SubmitButton>
            <p className="mt-4 text-center text-muted-foreground text-sm">
              {"Don't have an account? "}
              <Link
                className="font-semibold text-primary hover:underline"
                href="/register"
              >
                Sign up
              </Link>
              {" for free."}
            </p>
          </AuthForm>
        </div>

        {/* Demo Credentials */}
        <div className="rounded-lg bg-muted/50 p-4 text-xs space-y-2">
          <p className="font-medium text-muted-foreground">Demo Accounts:</p>
          <div className="grid grid-cols-2 gap-2 text-muted-foreground">
            <div>
              <span className="font-medium">Admin:</span> admin@arogya.gov.in
            </div>
            <div>
              <span className="font-medium">Officer:</span> officer@arogya.gov.in
            </div>
            <div>
              <span className="font-medium">ASHA:</span> asha@arogya.gov.in
            </div>
            <div>
              <span className="font-medium">Citizen:</span> citizen@example.com
            </div>
          </div>
          <p className="text-muted-foreground/70">Password: demo123</p>
        </div>
      </div>
    </div>
  );
}
