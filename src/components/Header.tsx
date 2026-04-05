"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { useAccessibility } from "./AccessibilityProvider";
import { Menu } from "lucide-react";
import React from "react";
import AccessibilityPanel from "./AccessibilityPanel";
import { authClient, useSession } from "@/lib/auth-client";
import { toast } from "sonner";

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { highContrast, setHighContrast } = useAccessibility();
  const [open, setOpen] = React.useState(false);
    const {data: session, isPending} = useSession();

    // Debug logging
    React.useEffect(() => {
        console.log("Header session data:", {session, isPending});
    }, [session, isPending]);

    const handleSignOut = async () => {
      const {error} = await authClient.signOut();
    if (error?.code) {
      toast.error(error.code);
    } else {
        toast.success("Signed out successfully");
      router.push("/");
    }
  };

  return (
    <header className="sticky top-0 z-50 glass border-b border-white/10" role="banner">
      <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 bg-primary text-primary-foreground px-4 py-2 rounded-full font-medium">
        Skip to main content
      </a>
      <nav aria-label="Primary" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-3 group focus:outline-none focus:ring-2 focus:ring-primary rounded-xl px-2 py-1 transition-all">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground font-bold text-xl shadow-lg shadow-primary/30 group-hover:scale-110 transition-transform duration-300" aria-hidden>
              S
            </div>
            <span className="font-extrabold text-2xl tracking-tighter text-gradient group-hover:opacity-80 transition-opacity">SAMAVESH</span>
          </Link>

          <div className="hidden lg:flex items-center gap-2" role="menubar">
            <NavLink href="/" current={pathname === "/"}>Home</NavLink>
            <NavLink href="/captions" current={pathname.startsWith("/captions")}>Live Captions</NavLink>
            <NavLink href="/reader" current={pathname.startsWith("/reader")}>Reader & OCR</NavLink>
          </div>

          <div className="flex items-center gap-4">
            <div className="hidden sm:flex items-center gap-3 bg-muted/50 p-1 rounded-full border border-white/10 px-3">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Contrast</span>
              <Switch id="contrast" checked={highContrast} onCheckedChange={setHighContrast} aria-label="Toggle high contrast theme" className="data-[state=checked]:bg-primary" />
            </div>
            
            <div className="flex items-center gap-2">
              <AccessibilityPanel />
              
              {!isPending && (
                session?.user ? (
                  <div className="hidden md:flex items-center gap-4 ml-2">
                    <div className="flex flex-col items-end">
                      <span className="text-sm font-bold truncate max-w-[150px]">
                        {session?.user?.name || "Member"}
                      </span>
                      <span className="text-[10px] text-muted-foreground font-medium uppercase tracking-tighter">
                        Active Session
                      </span>
                    </div>
                    <Button variant="ghost" size="sm" onClick={handleSignOut} className="rounded-full hover:bg-destructive/10 hover:text-destructive transition-colors border border-transparent hover:border-destructive/20">
                      Sign out
                    </Button>
                  </div>
                ) : (
                  <div className="hidden md:flex items-center gap-3 ml-2">
                    <Button asChild variant="ghost" size="sm" className="rounded-full font-semibold">
                      <Link href="/login">Sign In</Link>
                    </Button>
                    <Button asChild size="sm" className="rounded-full shadow-lg shadow-primary/20 font-semibold px-5">
                      <Link href="/register">Join Now</Link>
                    </Button>
                  </div>
                )
              )}
              
              <Button variant="outline" size="icon" className="md:hidden rounded-xl glass border-white/20" aria-expanded={open} aria-controls="mobile-menu" aria-label="Open menu" onClick={() => setOpen((o) => !o)}>
                <Menu className="size-5" />
              </Button>
            </div>
          </div>
        </div>
        
        {open && (
          <div id="mobile-menu" className="md:hidden py-4 animate-in slide-in-from-top-2 duration-300" role="menu">
            <div className="flex flex-col gap-2 glass p-4 rounded-2xl border-white/20">
              <MobileLink href="/" onClick={() => setOpen(false)} current={pathname === "/"}>Home</MobileLink>
              <MobileLink href="/captions" onClick={() => setOpen(false)} current={pathname.startsWith("/captions")}>Live Captions</MobileLink>
              <MobileLink href="/reader" onClick={() => setOpen(false)} current={pathname.startsWith("/reader")}>Reader & OCR</MobileLink>
              <div className="h-px bg-border my-2" />
              {!isPending && (
                session?.user ? (
                  <Button variant="ghost" onClick={() => { setOpen(false); handleSignOut(); }} className="w-full justify-start rounded-xl text-destructive hover:bg-destructive/10">
                    Sign out
                  </Button>
                ) : (
                  <div className="flex flex-col gap-2">
                    <Button asChild variant="ghost" className="w-full justify-start rounded-xl">
                      <Link href="/login" onClick={() => setOpen(false)}>Login</Link>
                    </Button>
                    <Button asChild className="w-full justify-start rounded-xl">
                      <Link href="/register" onClick={() => setOpen(false)}>Register</Link>
                    </Button>
                  </div>
                )
              )}
            </div>
          </div>
        )}
      </nav>
    </header>
  );
}

function NavLink({ href, current, children }: { href: string; current?: boolean; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      role="menuitem"
      aria-current={current ? "page" : undefined}
      className={`px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-ring ${current ? "bg-secondary" : "hover:bg-accent"}`}
    >
      {children}
    </Link>
  );
}

function MobileLink({ href, current, onClick, children }: { href: string; current?: boolean; onClick?: () => void; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      role="menuitem"
      aria-current={current ? "page" : undefined}
      onClick={onClick}
      className={`px-3 py-2 rounded focus:outline-none focus:ring-2 focus:ring-ring ${current ? "bg-secondary" : "hover:bg-accent"}`}
    >
      {children}
    </Link>
  );
}