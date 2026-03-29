"use client";
import { useForm } from "react-hook-form";

import InputField from "@/components/forms/InputField";
import { Button } from "@/components/ui/button";

const SignUp = () => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormData>({
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      country: "US",
      investmentGoals: "Growth",
      riskTolerance: "Medium",
      preferredIndustry: "Techlogy",
    },
    mode: "onSubmit",
  });

  const onSubmit = async (data: SignUpFormData) => {
    try {
    } catch (error) {
      console.log("e", error);
    }
  };

  return (
    <>
      <h1 className="form-title">Sing Up & Personalize</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <InputField
          name="fullName"
          label="Full Name"
          register={register}
          placeholder="John Doe"
          error={errors.fullName}
          validation={{
            required: "Full name is required",
            minLength: { value: 2, message: "Min length is 2" },
          }}
        />
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
          placeholder="Enter a strong password"
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
          {isSubmitting ? "Creating account" : "Start Your Investing Journey"}
        </Button>
      </form>
    </>
  );
};

export default SignUp;
