import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

const USER_TYPES = [
	{ value: "AGENT", label: "Real Estate Agent" },
	{ value: "OWNER", label: "Condo/Home Owner" },
	{ value: "SEEKER", label: "Property Seeker" },
];

export interface AuthUser {
	id: number;
	firstName: string;
	lastName: string;
	email: string;
	role: string;
}

interface AuthModalProps {
	open: boolean;
	onClose: () => void;
	onAuth: (user: AuthUser, token: string) => void;
}

const AuthModal = ({ open, onClose, onAuth }: AuthModalProps) => {
	const [isLogin, setIsLogin] = useState(true);
	const [firstName, setFirstName] = useState("");
	const [lastName, setLastName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [role, setRole] = useState(USER_TYPES[0].value);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState("");
	const [success, setSuccess] = useState("");

	// Reset form when modal opens
	useEffect(() => {
		if (open) {
			setFirstName("");
			setLastName("");
			setEmail("");
			setPassword("");
			setRole(USER_TYPES[0].value);
			setError("");
			setSuccess("");
		}
	}, [open, isLogin]);

	if (!open) return null;

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setLoading(true);
		setError("");
		setSuccess("");

		try {
			let query = "";
			if (isLogin) {
				query = `
          mutation {
            login(email: "${email}", password: "${password}") {
              user {
                id
                firstName
                lastName
                email
                role
              }
              token
            }
          }
        `;
			} else {
				query = `
          mutation {
            register(
              firstName: "${firstName}",
              lastName: "${lastName}",
              email: "${email}",
              password: "${password}",
              role: "${role}"
            ) {
              user {
                id
                firstName
                lastName
                email
                role
              }
              token
            }
          }
        `;
			}

			const res = await fetch("http://127.0.0.1:8000/graphql", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ query }),
			});

			const data = await res.json();

			if (data.errors && data.errors.length > 0) {
				setError(data.errors[0].message);
			} else {
				const payload = data.data?.login || data.data?.register;
				if (payload) {
					setSuccess(isLogin ? "Login successful!" : "Account created!");
					onAuth(payload.user, payload.token);

					setTimeout(() => {
						onClose();
					}, 1200);
				} else {
					setError("Unexpected error. Please try again.");
				}
			}
		} catch (err) {
			console.error(err);
			setError("Authentication failed. Check your network or credentials.");
		} finally {
			setLoading(false);
		}
	};

	return (
		<div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-40 min-h-screen overflow-auto">
			<div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md mx-auto flex flex-col">
				<h2 className="text-xl font-bold mb-4">
					{isLogin ? "Sign In" : "Create Account"}
				</h2>
				<form onSubmit={handleSubmit} className="space-y-4">
					{!isLogin && (
						<>
							<input
								type="text"
								placeholder="First Name"
								value={firstName}
								onChange={(e) => setFirstName(e.target.value)}
								className="w-full border rounded p-2"
								required
							/>
							<input
								type="text"
								placeholder="Last Name"
								value={lastName}
								onChange={(e) => setLastName(e.target.value)}
								className="w-full border rounded p-2"
								required
							/>
							<select
								value={role}
								onChange={(e) => setRole(e.target.value)}
								className="w-full border rounded p-2"
								required
							>
								{USER_TYPES.map((t) => (
									<option key={t.value} value={t.value}>
										{t.label}
									</option>
								))}
							</select>
						</>
					)}
					<input
						type="email"
						placeholder="Email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						className="w-full border rounded p-2"
						required
					/>
					<input
						type="password"
						placeholder="Password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						className="w-full border rounded p-2"
						required
					/>
					{error && <div className="text-red-500 text-sm">{error}</div>}
					{success && (
						<div className="text-green-600 text-sm font-semibold">{success}</div>
					)}
					<div className="flex justify-between items-center gap-2">
						<Button
							type="button"
							variant="outline"
							onClick={onClose}
							disabled={loading}
						>
							Cancel
						</Button>
						<Button type="submit" disabled={loading}>
							{loading
								? isLogin
									? "Signing In..."
									: "Creating..."
								: isLogin
									? "Sign In"
									: "Create Account"}
						</Button>
					</div>
				</form>
				<div className="mt-4 text-center">
					<button
						type="button"
						className="text-primary underline text-sm"
						onClick={() => setIsLogin(!isLogin)}
						disabled={loading}
					>
						{isLogin
							? "Don't have an account? Create one"
							: "Already have an account? Sign in"}
					</button>
				</div>
			</div>
		</div>
	);
};

export default AuthModal;