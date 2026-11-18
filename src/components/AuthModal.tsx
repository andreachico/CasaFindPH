import { useState } from "react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import type { AuthSession, SignUpRole } from "@/lib/auth";
import { signIn, signUp } from "@/lib/auth";

interface AuthModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAuthenticated: (session: AuthSession) => void;
}

export function AuthModal({ open, onOpenChange, onAuthenticated }: AuthModalProps) {
  const [mode, setMode] = useState<"signin" | "signup">("signin");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [signupRole, setSignupRole] = useState<SignUpRole>("SEEKER");
  const [submitting, setSubmitting] = useState(false);

  function resetForm() {
    setFirstName("");
    setLastName("");
    setEmail("");
    setPassword("");
    setSignupRole("SEEKER");
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);

    try {
      const session =
        mode === "signin"
          ? await signIn(email.trim(), password)
          : await signUp(firstName.trim(), lastName.trim(), email.trim(), password, signupRole);

      if (mode === "signup" && signupRole === "LISTER") {
        onOpenChange(false);
        resetForm();
        toast.success(
          "Account created! Please check your email to verify your account before you can log in and post listings.",
        );
        return;
      }

      onAuthenticated(session);
      onOpenChange(false);
      resetForm();
      toast.success(mode === "signin" ? "Welcome back!" : "Your account is ready.");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Authentication failed.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{mode === "signin" ? "Welcome back" : "Create your account"}</DialogTitle>
          <DialogDescription>
            {mode === "signin"
              ? "Sign in to save favorites and list your property."
              : "Join CasaFind to manage listings and browse local properties."}
          </DialogDescription>
        </DialogHeader>

        <div className="mb-4 flex rounded-lg border border-border bg-muted p-1">
          <button
            type="button"
            className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition ${
              mode === "signin" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
            }`}
            onClick={() => setMode("signin")}
          >
            Sign In
          </button>
          <button
            type="button"
            className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition ${
              mode === "signup" ? "bg-background text-foreground shadow-sm" : "text-muted-foreground"
            }`}
            onClick={() => setMode("signup")}
          >
            Sign Up
          </button>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {mode === "signup" && (
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="firstName">First name</Label>
                <Input
                  id="firstName"
                  value={firstName}
                  onChange={(event) => setFirstName(event.target.value)}
                  placeholder="Juan"
                  required={mode === "signup"}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last name</Label>
                <Input
                  id="lastName"
                  value={lastName}
                  onChange={(event) => setLastName(event.target.value)}
                  placeholder="Dela Cruz"
                  required={mode === "signup"}
                />
              </div>
            </div>
          )}

          {mode === "signup" && (
            <div className="space-y-2">
              <Label>I want to</Label>
              <RadioGroup
                value={signupRole}
                onValueChange={(value) => setSignupRole(value as SignUpRole)}
                className="gap-3"
              >
                <label
                  htmlFor="role-seeker"
                  className="flex cursor-pointer items-start gap-3 rounded-lg border border-border p-3 transition hover:bg-muted"
                >
                  <RadioGroupItem id="role-seeker" value="SEEKER" className="mt-0.5" />
                  <span className="space-y-0.5">
                    <span className="block text-sm font-medium">Seeker</span>
                    <span className="block text-xs text-muted-foreground">
                      Browse and save properties
                    </span>
                  </span>
                </label>
                <label
                  htmlFor="role-lister"
                  className="flex cursor-pointer items-start gap-3 rounded-lg border border-border p-3 transition hover:bg-muted"
                >
                  <RadioGroupItem id="role-lister" value="LISTER" className="mt-0.5" />
                  <span className="space-y-0.5">
                    <span className="block text-sm font-medium">Lister</span>
                    <span className="block text-xs text-muted-foreground">
                      List your properties (agent / owner). Requires email verification.
                    </span>
                  </span>
                </label>
              </RadioGroup>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
              minLength={8}
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={submitting}>
            {submitting ? "Please wait..." : mode === "signin" ? "Sign In" : "Create account"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
