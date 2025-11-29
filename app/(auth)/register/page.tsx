"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useActionState, useEffect, useState } from "react";
import { AuthForm } from "@/components/auth-form";
import { SubmitButton } from "@/components/submit-button";
import { toast } from "@/components/toast";
import { cn } from "@/lib/utils";
import { type RegisterActionState, register } from "../actions";

const roles = [
  {
    id: "citizen",
    label: "नागरिक",
    labelEn: "Citizen",
    icon: "👨‍👩‍👧‍👦",
    description: "General public seeking health services",
  },
  {
    id: "asha",
    label: "आशा कार्यकर्ता",
    labelEn: "ASHA Worker",
    icon: "👩‍⚕️",
    description: "Accredited Social Health Activist",
  },
  {
    id: "officer",
    label: "अधिकारी",
    labelEn: "Health Officer",
    icon: "🏥",
    description: "District/Block Health Officer",
  },
] as const;

const districts = [
  "Pune",
  "Mumbai",
  "Nagpur",
  "Thane",
  "Nashik",
  "Aurangabad",
  "Solapur",
  "Kolhapur",
  "Sangli",
  "Satara",
  "Ratnagiri",
  "Sindhudurg",
  "Ahmednagar",
  "Jalgaon",
  "Dhule",
  "Nandurbar",
  "Beed",
  "Latur",
  "Osmanabad",
  "Parbhani",
  "Hingoli",
  "Nanded",
  "Akola",
  "Washim",
  "Amravati",
  "Buldhana",
  "Yavatmal",
  "Wardha",
  "Chandrapur",
  "Bhandara",
  "Gondia",
  "Gadchiroli",
];

export default function Page() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>("citizen");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [district, setDistrict] = useState("");
  const [isSuccessful, setIsSuccessful] = useState(false);

  const [state, formAction] = useActionState<RegisterActionState, FormData>(
    register,
    {
      status: "idle",
    }
  );

  const { update: updateSession } = useSession();

  useEffect(() => {
    if (state.status === "user_exists") {
      toast({ type: "error", description: "Account already exists!" });
    } else if (state.status === "failed") {
      toast({ type: "error", description: "Failed to create account!" });
    } else if (state.status === "invalid_data") {
      toast({
        type: "error",
        description: "Failed validating your submission!",
      });
    } else if (state.status === "success") {
      toast({ type: "success", description: "Account created successfully!" });

      setIsSuccessful(true);
      updateSession();
      
      // Redirect based on role
      router.push("/");
      router.refresh();
    }
  }, [state.status, router, updateSession]);

  const handleSubmit = (formData: FormData) => {
    setEmail(formData.get("email") as string);
    formData.append("role", selectedRole);
    formData.append("name", name);
    formData.append("phone", phone);
    formData.append("district", district);
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
            Join Arogya Mitra
          </h1>
          <p className="text-muted-foreground text-sm">
            Create your account for Maharashtra Rural Health Platform
          </p>
        </div>

        {/* Role Selection */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-muted-foreground">
            I am registering as / मी नोंदणी करत आहे
          </label>
          <div className="grid grid-cols-3 gap-3">
            {roles.map((role) => (
              <button
                key={role.id}
                type="button"
                onClick={() => setSelectedRole(role.id)}
                className={cn(
                  "flex flex-col items-center gap-2 rounded-xl border-2 p-3 transition-all hover:shadow-md",
                  selectedRole === role.id
                    ? "border-primary bg-primary/5 shadow-md"
                    : "border-muted hover:border-muted-foreground/30"
                )}
              >
                <span className="text-2xl">{role.icon}</span>
                <div className="flex flex-col items-center">
                  <span className="font-medium text-xs">{role.labelEn}</span>
                  <span className="text-[10px] text-muted-foreground">
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

        {/* Additional Fields for Non-Citizen Roles */}
        {selectedRole !== "citizen" && (
          <div className="space-y-4 rounded-lg bg-muted/30 p-4">
            <h4 className="text-sm font-medium">Professional Details</h4>
            <div className="grid gap-3">
              <div>
                <label className="text-xs text-muted-foreground">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your full name"
                  className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm"
                  required
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">Phone Number</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="+91 XXXXX XXXXX"
                  className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm"
                  required
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">District</label>
                <select
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                  className="mt-1 w-full rounded-md border bg-background px-3 py-2 text-sm"
                  required
                >
                  <option value="">Select District</option>
                  {districts.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Registration Form */}
        <div className="space-y-4">
          <div className="flex flex-col items-center gap-1">
            <h3 className="font-semibold text-lg dark:text-zinc-50">
              Create Your Account
            </h3>
          </div>
          
          <AuthForm action={handleSubmit} defaultEmail={email}>
            <SubmitButton isSuccessful={isSuccessful}>
              Register as {currentRole?.labelEn}
            </SubmitButton>
            <p className="mt-4 text-center text-muted-foreground text-sm">
              {"Already have an account? "}
              <Link
                className="font-semibold text-primary hover:underline"
                href="/login"
              >
                Sign in
              </Link>
              {" instead."}
            </p>
          </AuthForm>
        </div>

        {/* Note */}
        <p className="text-xs text-center text-muted-foreground">
          Admin accounts can only be created by existing administrators.
        </p>
      </div>
    </div>
  );
}
