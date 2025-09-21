import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/contexts/AuthContext";
import api from "@/lib/api";
import { Loader2 } from "lucide-react";
import { useState, type FormEvent } from "react";

export function AuthForm() {
  const [isSignUp, setIsSignup] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsloading] = useState(false);
  const { login } = useAuth();

  const handleLogin = async (e: FormEvent) => {
    setIsloading(true);

    e.preventDefault();
    await new Promise((res) => setTimeout(res, 500));
    if (!email || !password) {
      setErrorMsg("Email or password can't be empty!");
      setIsloading(false);
      return;
    }
    try {
      const res = await api.post("/auth/login", { email, password });

      login(res.data.token);
      setIsloading(false);
    } catch (error) {
      console.error(error);
      setErrorMsg("check your credentials");
      setIsloading(false);
    }
  };

  const handleSignup = async (e: FormEvent) => {
    setIsloading(true);
    e.preventDefault();
    await new Promise((res) => setTimeout(res, 500));

    if (!email || !password) {
      setErrorMsg("Email or password can't be empty!");
      setIsloading(false);
      return;
    }
    if (password !== confirmPassword) {
      setErrorMsg("Passwords don't match");
      setIsloading(false);
      return;
    }

    try {
      const res = await api.post("/auth/signup", { email, password });
      if (res.status !== 200) setErrorMsg("Failed to sign up");

      const loginRes = await api.post("/auth/login/", { email, password });

      if (loginRes.status !== 200) setErrorMsg("Failed to login");

      login(loginRes.data.token);
      setIsloading(false);
    } catch (error) {
      console.error(error);
      setErrorMsg("Failed to create account or account already exists");
      setIsloading(false);
    }
  };
  return (
    <Card className="w-full max-w-sm h-fit absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 size">
      <CardHeader>
        <CardTitle>{!isSignUp ? "Login" : "Sign up"} to your account</CardTitle>
        <CardDescription>
          Enter your email below to {!isSignUp ? "login" : "signup"} to your
          account
        </CardDescription>
        <CardAction>
          <Button variant="link" onClick={() => setIsSignup((p) => !p)}>
            Switch {!isSignUp ? "Sign Up" : "log in"}
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <form>
          <div className="flex flex-col gap-6">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={email}
                required
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="password">Password</Label>

              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                title="Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters"
                required
              />
            </div>
            {isSignUp && (
              <div className="grid gap-2">
                <Label htmlFor="confirmPassword">Confirm Password</Label>

                <Input
                  id="confirmPassword"
                  type="Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  pattern="(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}"
                  title="Must contain at least one number and one uppercase and lowercase letter, and at least 8 or more characters"
                  required
                />
              </div>
            )}
            <Button
              onClick={!isSignUp ? handleLogin : handleSignup}
              className="w-full gap-2"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="animate-spin w-4 h-4" />
                  Loading...
                </>
              ) : !isSignUp ? (
                "Login"
              ) : (
                "Sign up"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
      <CardFooter className="flex-col gap-2">
        {/* <Button variant="outline" className="w-full">
          Login with Google
        </Button> */}

        {!isSignUp && (
          <a href="#" className="  text-sm underline-offset-4 hover:underline">
            Forgot your password?
          </a>
        )}
        <span className="text-rose-600 text-lg">{errorMsg}</span>
      </CardFooter>
    </Card>
  );
}
