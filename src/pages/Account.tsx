import { Button } from "@/components/ui/button";
import Header from "@/components/Header";
import type { AuthSession } from "@/lib/auth";

interface AccountPageProps {
  session: AuthSession | null;
  onAuthenticated: (session: AuthSession) => void;
  onSignOut: () => void;
}

const AccountPage = ({ session, onAuthenticated, onSignOut }: AccountPageProps) => {
  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header session={session} onAuthenticated={onAuthenticated} onSignOut={onSignOut} />
      <div className="px-4 pb-16 pt-28 md:pt-32">
        <div className="relative mx-auto max-w-3xl overflow-hidden rounded-2xl border border-primary-foreground/10 bg-gradient-hero p-8 text-primary-foreground shadow-lg">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-primary-foreground/80">Account</p>
            <h1 className="mt-2 text-3xl font-bold text-primary-foreground">
              {session.user.firstName} {session.user.lastName}
            </h1>
          </div>
          <Button
            variant="outline"
            onClick={onSignOut}
            className="border-primary-foreground/30 bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20 hover:text-primary-foreground"
          >
            Sign Out
          </Button>
        </div>

        <div className="mt-8 grid gap-4 md:grid-cols-2">
          <div className="rounded-xl border border-primary-foreground/10 bg-primary-foreground/5 p-4">
            <p className="text-sm text-primary-foreground/70">Email</p>
            <p className="mt-2 text-base font-medium text-primary-foreground">{session.user.email}</p>
          </div>
          <div className="rounded-xl border border-primary-foreground/10 bg-primary-foreground/5 p-4">
            <p className="text-sm text-primary-foreground/70">Role</p>
            <p className="mt-2 text-base font-medium text-primary-foreground">{session.user.role}</p>
          </div>
        </div>

        <div className="mt-8 rounded-xl border border-dashed border-primary-foreground/20 bg-primary-foreground/5 p-6">
          <p className="text-lg font-semibold text-primary-foreground">Your property dashboard</p>
          <p className="mt-2 text-sm text-primary-foreground/70">
            This account page is ready for your saved homes, listing management, and account settings.
          </p>
        </div>
        </div>
      </div>
    </div>
  );
};

export default AccountPage;
