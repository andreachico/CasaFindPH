import { Button } from "@/components/ui/button";
import type { AuthSession } from "@/lib/auth";

interface AccountPageProps {
  session: AuthSession | null;
  onSignOut: () => void;
}

const AccountPage = ({ session, onSignOut }: AccountPageProps) => {
  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background px-4 py-16">
      <div className="mx-auto max-w-3xl rounded-2xl border border-border bg-card p-8 shadow-sm">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary">Account</p>
            <h1 className="mt-2 text-3xl font-bold text-foreground">
              {session.user.firstName} {session.user.lastName}
            </h1>
          </div>
          <Button variant="outline" onClick={onSignOut}>
            Sign Out
          </Button>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-border bg-muted/60 p-4">
            <p className="text-sm text-muted-foreground">Email</p>
            <p className="mt-2 text-base font-medium text-foreground">{session.user.email}</p>
          </div>
          <div className="rounded-xl border border-border bg-muted/60 p-4">
            <p className="text-sm text-muted-foreground">Role</p>
            <p className="mt-2 text-base font-medium text-foreground">{session.user.role}</p>
          </div>
        </div>

        <div className="mt-8 rounded-xl border border-dashed border-border bg-muted/30 p-6">
          <p className="text-lg font-semibold text-foreground">Your property dashboard</p>
          <p className="mt-2 text-sm text-muted-foreground">
            This account page is ready for your saved homes, listing management, and account settings.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
