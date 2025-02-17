import { useEffect } from "react";
import { useLocation } from "wouter";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/use-auth";
import { insertUserSchema } from "@shared/schema";
import { SiTradingview, SiGoogle } from "react-icons/si";

export default function AuthPage() {
  const [, setLocation] = useLocation();
  const [isRegistering, setIsRegistering] = React.useState(false);
  const { user, loginMutation, registerMutation } = useAuth();
  const form = useForm({
    resolver: zodResolver(insertUserSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  useEffect(() => {
    if (user) {
      setLocation("/");
    }
  }, [user, setLocation]);

  const onSubmit = async (data: { username: string; password: string }) => {
    loginMutation.mutate(data);
  };

  const onRegister = async (data: { username: string; password: string }) => {
    registerMutation.mutate(data);
  };

  return (
    <div className="min-h-screen grid md:grid-cols-2">
      <div className="flex items-center justify-center p-8">
        <Card className="w-full max-w-md p-6 space-y-6">
          <div className="flex items-center space-x-2">
            <SiTradingview className="h-6 w-6 text-primary" />
            <h1 className="text-2xl font-bold">CryptoAI Advisor</h1>
          </div>
          
          <Button
            variant="outline"
            className="w-full flex items-center gap-2"
            onClick={() => window.location.href = "/api/auth/google"}
          >
            <SiGoogle className="h-4 w-4" />
            Continue with Google
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <Separator />
            </div>
            <div className="relative flex justify-center">
              <span className="bg-background px-2 text-muted-foreground text-sm">
                or continue with
              </span>
            </div>
          </div>

          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="username"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Username</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter your username" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter your password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="space-y-2">
                {!isRegistering ? (
                  <>
                    <Button
                      type="submit"
                      className="w-full"
                      disabled={loginMutation.isPending}
                    >
                      Sign In
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={() => setIsRegistering(true)}
                    >
                      Create Account
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      type="button"
                      className="w-full"
                      onClick={form.handleSubmit(onRegister)}
                      disabled={registerMutation.isPending}
                    >
                      Create Account
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full"
                      onClick={() => setIsRegistering(false)}
                    >
                      Back to Sign In
                    </Button>
                  </>
                )}
              </div>
            </form>
          </Form>
        </Card>
      </div>
      <div className="hidden md:block bg-muted">
        <div className="h-full p-8 flex flex-col justify-center space-y-6">
          <h2 className="text-4xl font-bold tracking-tight">
            AI-Powered Trading Analysis
          </h2>
          <p className="text-muted-foreground text-lg">
            Upload your trading charts and get instant AI-generated analysis,
            strategies, and risk assessments to help make better trading decisions.
          </p>
        </div>
      </div>
    </div>
  );
}
