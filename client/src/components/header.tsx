import { Link } from "wouter";
import { SiTradingview } from "react-icons/si";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/use-auth";
import { User } from "lucide-react";

export default function Header() {
  const { user, logoutMutation } = useAuth();

  return (
    <header className="border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/">
            <div className="flex items-center space-x-2 cursor-pointer">
              <SiTradingview className="h-6 w-6 text-primary" />
              <span className="font-bold text-xl">TradingVision AI</span>
            </div>
          </Link>
          <nav className="flex items-center space-x-4">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.displayName || user.username}
                        className="h-8 w-8 rounded-full"
                      />
                    ) : (
                      <User className="h-5 w-5" />
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  <DropdownMenuItem
                    onClick={() => logoutMutation.mutate()}
                    disabled={logoutMutation.isPending}
                  >
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/auth">
                <Button variant="secondary">Sign In</Button>
              </Link>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}