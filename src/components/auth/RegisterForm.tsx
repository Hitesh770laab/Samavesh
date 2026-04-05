"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import { motion } from "framer-motion";

export const RegisterForm: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = React.useState(false);
  const [form, setForm] = React.useState({
    name: "",
    email: "",
    password: "",
    confirm: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirm) {
      toast.error("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const { error } = await authClient.signUp.email({
        email: form.email,
        name: form.name,
        password: form.password,
      });

      if (error?.code) {
        const map: Record<string, string> = {
          USER_ALREADY_EXISTS: "Email already registered",
        };
        toast.error(map[error.code] || "Registration failed");
        return;
      }

      toast.success("Account created! Please log in.");
      router.push("/login?registered=true");
    } catch (err) {
      toast.error("Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9, rotateY: -10 }}
      animate={{ opacity: 1, scale: 1, rotateY: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="space-y-6 max-w-md w-full glass p-8 rounded-3xl shadow-2xl border-white/20 animate-float"
      style={{ perspective: 1000 }}
    >
      <div className="text-center mb-2">
        <h1 className="text-3xl font-extrabold tracking-tight text-gradient">Create Account</h1>
        <p className="text-muted-foreground mt-2">Join us to start your learning journey</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label htmlFor="name">Full Name</Label>
          <Input
            id="name"
            required
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            placeholder="John Doe"
            className="rounded-xl h-11 bg-white/50 border-white/30 focus:ring-primary/50"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            required
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            autoComplete="email"
            placeholder="you@example.com"
            className="rounded-xl h-11 bg-white/50 border-white/30 focus:ring-primary/50"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            type="password"
            required
            value={form.password}
            onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
            autoComplete="off"
            placeholder="••••••••"
            className="rounded-xl h-11 bg-white/50 border-white/30 focus:ring-primary/50"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirm">Confirm Password</Label>
          <Input
            id="confirm"
            type="password"
            required
            value={form.confirm}
            onChange={(e) => setForm((f) => ({ ...f, confirm: e.target.value }))}
            autoComplete="off"
            placeholder="••••••••"
            className="rounded-xl h-11 bg-white/50 border-white/30 focus:ring-primary/50"
          />
        </div>

        <Button type="submit" className="w-full h-12 rounded-xl text-lg font-semibold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all active:scale-95" disabled={loading}>
          {loading ? "Creating account..." : "Create account"}
        </Button>
      </form>
    </motion.div>
  );
};

export default RegisterForm;