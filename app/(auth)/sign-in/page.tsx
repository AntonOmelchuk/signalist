"use client";
import { useForm } from "react-hook-form";

import FooterLink from "@/components/forms/FooterLink";
import InputField from "@/components/forms/InputField";
import { Button } from "@/components/ui/button";

const SignIn = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormData>({
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onSubmit",
  });

  const onSubmit = async (data: SignInFormData) => {
    try {
    } catch (error) {
      console.log("e", error);
    }
  };

  return (
    <>
      <h1 className="form-title">Welcome back</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <InputField
          name="email"
          label="Email"
          register={register}
          error={errors.email}
          placeholder="example@email.com"
          validation={{
            required: "Email is required",
            pattern: /^\w+@\w+\.\w+$/,
            message: "Email is required",
          }}
        />
        <InputField
          type="password"
          name="password"
          label="Password"
          register={register}
          error={errors.password}
          placeholder="Enter your password"
          validation={{
            required: "Password is reqired",
            minLength: { value: 8, message: "Min length is 8" },
          }}
        />
        <Button
          type="submit"
          disabled={isSubmitting}
          className="yellow-btn w-full mt-5"
        >
          {isSubmitting ? "Signing In" : "Sign In"}
        </Button>

        <FooterLink
          text="Don't have an account?"
          linkText="Create an account"
          href="/sign-up"
        />
      </form>
    </>
  );
};

export default SignIn;
