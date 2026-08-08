"use client";

import { Suspense, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { resetPasswordSchema } from "@/validations/auth.schema";
import { z } from "zod";

type ResetInput = z.infer<typeof resetPasswordSchema>;

function ResetPasswordFormContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [message, setMessage] = useState("");

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ResetInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { token },
  });

  const onSubmit = async (data: ResetInput) => {
    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    setMessage(json.message ?? json.error ?? "Done");
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <input type="hidden" {...register("token")} />
      <div className="space-y-2">
        <Label>New Password</Label>
        <Input type="password" {...register("password")} />
        {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
      </div>
      <div className="space-y-2">
        <Label>Confirm Password</Label>
        <Input type="password" {...register("confirmPassword")} />
        {errors.confirmPassword && <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>}
      </div>
      {message && <p className="text-sm text-center">{message}</p>}
      <Button type="submit" className="w-full" disabled={isSubmitting}>Reset Password</Button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Reset Password</CardTitle>
          <CardDescription>Enter your new password</CardDescription>
        </CardHeader>
        <CardContent>
          <Suspense fallback={<div className="flex justify-center p-4"><Loader2 className="h-6 w-6 animate-spin text-emerald-600" /></div>}>
            <ResetPasswordFormContent />
          </Suspense>
          <Link href="/login" className="mt-4 block text-center text-sm text-emerald-600">Back to login</Link>
        </CardContent>
      </Card>
    </div>
  );
}
