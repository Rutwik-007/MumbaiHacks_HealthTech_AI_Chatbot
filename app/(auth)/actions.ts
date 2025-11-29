"use server";

import { z } from "zod";

import { createUser, getUser } from "@/lib/db/queries";
import type { UserRole } from "@/lib/db/schema";

import { signIn } from "./auth";

const authFormSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

const registerFormSchema = authFormSchema.extend({
  role: z.enum(["citizen", "asha", "officer", "admin"]).optional(),
  name: z.string().optional(),
  phone: z.string().optional(),
  district: z.string().optional(),
});

export type LoginActionState = {
  status:
    | "idle"
    | "in_progress"
    | "success"
    | "failed"
    | "invalid_data"
    | "role_mismatch";
};

export const login = async (
  _: LoginActionState,
  formData: FormData
): Promise<LoginActionState> => {
  try {
    const validatedData = authFormSchema.parse({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    // Check if user exists first
    const [existingUser] = await getUser(validatedData.email);
    if (!existingUser) {
      return { status: "failed" };
    }

    // Determine redirect based on user role
    let redirectTo = "/";
    switch (existingUser.role) {
      case "admin":
        redirectTo = "/admin";
        break;
      case "officer":
        redirectTo = "/officer";
        break;
      case "asha":
        redirectTo = "/asha";
        break;
      default:
        redirectTo = "/"; // Citizens go to chat
    }

    // Use redirect: true so NextAuth properly sets cookies
    // This will throw NEXT_REDIRECT which needs to be re-thrown
    await signIn("credentials", {
      email: validatedData.email,
      password: validatedData.password,
      redirect: true,
      redirectTo,
    });

    // This won't be reached due to redirect
    return { status: "success" };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { status: "invalid_data" };
    }
    
    // Re-throw redirect errors (these are expected on success)
    if (error instanceof Error && 
        (error.message.includes("NEXT_REDIRECT") || 
         (error as any).digest?.includes("NEXT_REDIRECT"))) {
      throw error;
    }

    return { status: "failed" };
  }
};

export type RegisterActionState = {
  status:
    | "idle"
    | "in_progress"
    | "success"
    | "failed"
    | "user_exists"
    | "invalid_data";
};

export const register = async (
  _: RegisterActionState,
  formData: FormData
): Promise<RegisterActionState> => {
  try {
    const validatedData = registerFormSchema.parse({
      email: formData.get("email"),
      password: formData.get("password"),
      role: formData.get("role") || "citizen",
      name: formData.get("name"),
      phone: formData.get("phone"),
      district: formData.get("district"),
    });

    const [user] = await getUser(validatedData.email);

    if (user) {
      return { status: "user_exists" } as RegisterActionState;
    }

    await createUser(
      validatedData.email,
      validatedData.password,
      (validatedData.role as UserRole) || "citizen",
      {
        name: validatedData.name,
        phone: validatedData.phone,
        district: validatedData.district,
      }
    );

    // Use redirect: true so NextAuth properly sets cookies
    await signIn("credentials", {
      email: validatedData.email,
      password: validatedData.password,
      redirect: true,
      redirectTo: "/",
    });

    return { status: "success" };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return { status: "invalid_data" };
    }

    // Re-throw redirect errors (these are expected on success)
    if (error instanceof Error && 
        (error.message.includes("NEXT_REDIRECT") || 
         (error as any).digest?.includes("NEXT_REDIRECT"))) {
      throw error;
    }

    return { status: "failed" };
  }
};
