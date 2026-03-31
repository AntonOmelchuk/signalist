"use client";
import { useForm } from "react-hook-form";

import { CountrySelectField } from "@/components/forms/CountrySelectField";
import FooterLink from "@/components/forms/FooterLink";
import InputField from "@/components/forms/InputField";
import SelectField from "@/components/forms/SelectField";
import { Button } from "@/components/ui/button";
import {
  INVESTMENT_GOALS,
  PREFERRED_INDUSTRIES,
  RISK_TOLERANCE_OPTIONS,
} from "@/lib/constants";

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
        <CountrySelectField
          name="country"
          label="Country"
          control={control}
          error={errors.country}
          required
        />
        <SelectField
          name="investmentGoals"
          label="Investment Goals"
          error={errors.investmentGoals}
          placeholder="Select your investment goal"
          options={INVESTMENT_GOALS}
          control={control}
          required
        />
        <SelectField
          name="riskTolerance"
          label="Risk Tolerance"
          error={errors.riskTolerance}
          placeholder="Select your risk level"
          options={RISK_TOLERANCE_OPTIONS}
          control={control}
          required
        />
        <SelectField
          name="prefferedIndustry"
          label="Preffered Industry"
          error={errors.preferredIndustry}
          placeholder="Select your preffered industry"
          options={PREFERRED_INDUSTRIES}
          control={control}
          required
        />
        <Button
          type="submit"
          disabled={isSubmitting}
          className="yellow-btn w-full mt-5"
        >
          {isSubmitting ? "Creating account" : "Start Your Investing Journey"}
        </Button>

        <FooterLink
          text="Already have an account"
          linkText="Sign in"
          href="/sign-in"
        />
      </form>
    </>
  );
};

export default SignUp;
