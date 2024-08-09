"use client";

import { useState } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { Button, buttonVariants } from "../ui/button";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Label } from "../ui/label";
import { Input } from "../ui/input";

const ResetComponent = () => {
  const supabase = createClientComponentClient();
  const [data, setData] = useState<{
    password: string;
    confirmPassword: string;
  }>({
    password: "",
    confirmPassword: "",
  });

  const router = useRouter();

  const [showPassword, setShowPassword] = useState<boolean>(false);

  const confirmPasswords = async () => {
    const { password, confirmPassword } = data;
    if (password !== confirmPassword)
      return alert(`Your passwords are incorrect`);

    const { data: resetData, error } = await supabase.auth.updateUser({
      password: data.password,
    });

    if (resetData) {
      router.push("/");
    }
    if (error) console.log(error);
  };

  const handleChange = (e: any) => {
    const { name, value } = e.target;
    setData((prev: any) => ({
      ...prev,
      [name]: value,
    }));
  };
  return (
    <>
      <div className="container relative  h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <Link
          href="/login"
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "absolute right-4 top-4 md:right-8 md:top-8"
          )}
        >
          Back
        </Link>
        <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
          <div className="absolute inset-0 bg-zinc-900" />
          <div className="relative z-20 flex items-center text-lg font-medium">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2 h-6 w-6"
            >
              <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
            </svg>
            Nyayanidhi
          </div>
          <div className="relative z-20 mt-auto">
            <blockquote className="space-y-2">
              <p className="text-lg">
                &ldquo;Transform two weeks of legal effort into under 10
                minutes. Scale your practice 5x with cost-effective automation
                handling 80% of knowledge work.&rdquo;
              </p>
              <footer className="text-sm">Nyayanidhi</footer>
            </blockquote>
          </div>
        </div>
        <div className="lg:p-8 flex items-center justify-center h-screen">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">
                Reset you password
              </h1>
              <p className="text-sm text-muted-foreground">
                Enter password below
              </p>
            </div>
            <div className={cn("grid gap-6")}>
              <div>
                <div className="grid gap-2">
                  <div className="grid gap-1">
                    <Label className="sr-only" htmlFor="email">
                      Password
                    </Label>
                    <Input
                      type={showPassword ? "text" : "password"}
                      value={data?.password}
                      placeholder="Password"
                      onChange={handleChange}
                      autoCapitalize="none"
                      autoComplete="email"
                      autoCorrect="off"
                    />
                  </div>
                  <div className="grid gap-1">
                    <Label className="sr-only" htmlFor="email">
                      Confirm Password
                    </Label>
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Confirm password"
                      value={data?.confirmPassword}
                      onChange={handleChange}
                      autoCapitalize="none"
                      autoCorrect="off"
                    />
                  </div>
                  <div
                    className="cursor-pointer hover:underline"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <p className="text-sm">Show passwords</p>
                  </div>
                  <Button onClick={() => confirmPasswords()}>
                    Reset Password
                  </Button>
                </div>
              </div>
            </div>
            <p className="px-8 text-center text-sm text-muted-foreground">
              By clicking continue, you agree to our{" "}
              <Link
                href="/"
                className="underline underline-offset-4 hover:text-primary"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/"
                className="underline underline-offset-4 hover:text-primary"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default ResetComponent;
