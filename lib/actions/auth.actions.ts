"use server";

import { success } from "better-auth";
import { headers } from "next/headers";

import { auth } from "../better-auth/auth";
import inngest from "../inngest/client";

export const signUpWithEmail = async ({
  email,
  password,
  fullName,
  country,
  investmentGoals,
  riskTolerance,
  preferredIndustry,
}: SignUpFormData) => {
  try {
    const response = await auth?.api.signUpEmail({
      body: {
        email,
        password,
        name: fullName,
      },
    });

    if (response) {
      await inngest.send({
        name: "app/user.created",
        data: {
          email,
          name: fullName,
          country,
          investmentGoals,
          riskTolerance,
          preferredIndustry,
        },
      });
    }

    return { success: true, data: response };
  } catch (error) {
    console.log("Sign up failed", error);
    throw error instanceof Error ? error : new Error("Sign up failed!");
  }
};

export const signOut = async () => {
  try {
    await auth?.api.signOut({
      headers: await headers(),
    });
  } catch (error) {
    console.log("Sign out faided", error);
    return { success: false, error: "Sign out failed" };
  }
};

export const signInWithEmail = async ({ email, password }: SignInFormData) => {
  try {
    const response = await auth?.api.signInEmail({ body: { email, password } });

    return { success: true, data: response };
  } catch (error) {
    console.log("Sign in failed", error);
    return { success: false, error: "Sign in failed" };
  }
};
