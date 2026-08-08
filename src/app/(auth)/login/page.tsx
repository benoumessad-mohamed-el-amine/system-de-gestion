"use client";

import { Suspense, useState } from "react";
import { signIn } from "next-auth/react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { ShoppingCart, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { loginSchema, type LoginInput } from "@/validations/auth.schema";

function LoginFormContent() {
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/dashboard";
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "admin@pos.local", password: "Admin@123456" },
  });

  const onSubmit = async (data: LoginInput) => {
    setError("");
    const result = await signIn("credentials", {
      email: data.email,
      password: data.password,
      redirect: false,
    });

    if (result?.error) {
      setError("Invalid email or password");
      return;
    }

    window.location.href = callbackUrl;
  };

  return (
    <form method="POST" onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input id="email" type="email" {...register("email")} />
        {errors.email && (
          <p className="text-sm text-red-500">{errors.email.message}</p>
        )}
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Password</Label>
        <Input id="password" type="password" {...register("password")} />
        {errors.password && (
          <p className="text-sm text-red-500">{errors.password.message}</p>
        )}
      </div>
      {error && <p className="text-sm text-red-500 text-center">{error}</p>}
      <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Signing in...
          </>
        ) : (
          "Sign In"
        )}
      </Button>
    </form>
  );
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-emerald-50 to-zinc-100 p-4 dark:from-zinc-950 dark:to-zinc-900">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-600 text-white">
            <ShoppingCart className="h-6 w-6" />
          </div>
          <CardTitle className="text-2xl">RetailPOS</CardTitle>
          <CardDescription>Sign in to your POS account</CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<div className="flex justify-center p-4"><Loader2 className="h-6 w-6 animate-spin text-emerald-600" /></div>}>
            <LoginFormContent />
          </Suspense>
          <p className="mt-4 text-center text-sm text-zinc-500 dark:text-zinc-400">
            <Link href="/forgot-password" className="text-emerald-600 hover:underline">
              Forgot password?
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
