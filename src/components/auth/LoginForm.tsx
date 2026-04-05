"use client";
import * as React from "react";
import { motion } from "framer-motion";
import { useRouter, useSearchParams } from "next/navigation";
import {authClient} from "@/lib/auth-client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";

export const LoginForm: React.FC = () => {
  const router = useRouter();
  const search = useSearchParams();
  const [loading, setLoading] = React.useState(false);

  const [form, setForm] = React.useState({
    email: "",
    password: "",
    rememberMe: true,
  });

  const registered = search?.get("registered");
  React.useEffect(() => {
    if (registered) {
      toast.success("Account created! Please log in.");
    }
  }, [registered]);

    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

      try {
          console.log("Attempting to sign in to:", process.env.NEXT_PUBLIC_API_URL);

        const response = await authClient.signIn.email({
        email: form.email,
        password: form.password,
        rememberMe: form.rememberMe,
      });

        if (response.error) {
           const code = response.error.code;
           if (code === "INVALID_EMAIL_OR_PASSWORD") {
               toast.error("Invalid email or password.");
           } else if (code === "USER_NOT_FOUND") {
               toast.error("No account found with this email.");
           } else {
               toast.error(`Login failed: ${response.error.message || "Please check your network."}`);
           }
            return;
        }

        if (response.data) {
          toast.success("Welcome back!");
          router.push("/captions");
        }
    } catch (err: any) {
        console.error("Login critical error:", err);
        toast.error("Network error. Please make sure the server is running on port 3000.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20, rotateX: 10 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="space-y-6 max-w-md w-full glass p-8 rounded-3xl shadow-2xl border-white/20 animate-float"
      style={{ perspective: 1000 }}
    >
          <div className="text-center mb-2">
              <h1 className="text-3xl font-extrabold tracking-tight text-gradient">Welcome Back</h1>
              <p className="text-muted-foreground mt-2">Enter your credentials to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
              <div className="space-y-2">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                      id="email"
                      type="email"
                      required
                      value={form.email}
                      onChange={(e) => setForm((f) => ({...f, email: e.target.value}))}
                      autoComplete="email"
                      placeholder="you@example.com"
                      className="rounded-xl h-12 bg-white/50 border-white/30 focus:ring-primary/50"
                  />
              </div>

          <div className="space-y-2">
              <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
              </div>
              <Input
                  id="password"
                  type="password"
                  required
                  value={form.password}
                  onChange={(e) => setForm((f) => ({...f, password: e.target.value}))}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  className="rounded-xl h-12 bg-white/50 border-white/30 focus:ring-primary/50"
              />
          </div>

          <div className="flex items-center gap-2">
              <Checkbox
                  id="remember"
                  checked={form.rememberMe}
                  onCheckedChange={(v) => setForm((f) => ({...f, rememberMe: Boolean(v)}))}
                  className="border-primary/50 data-[state=checked]:bg-primary"
              />
              <Label htmlFor="remember" className="text-sm text-muted-foreground cursor-pointer select-none">
                  Stay signed in for 7 days
              </Label>
          </div>

          <Button type="submit" className="w-full h-12 rounded-xl text-lg font-semibold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all active:scale-95" disabled={loading}>
              {loading ? "Verifying..." : "Sign in"}
          </Button>
      </form>
    </motion.div>
  );
};

export default LoginForm;