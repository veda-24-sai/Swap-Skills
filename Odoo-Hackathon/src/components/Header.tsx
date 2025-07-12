import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Users,
  Search,
  MessageSquare,
  Settings,
  LogIn,
  LogOut,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

const Header = () => {
  const location = useLocation();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [name, setName] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const isActive = (path: string) => location.pathname === path;

  const navItems = [
    { path: "/", label: "Home", icon: Users },
    { path: "/browse", label: "Browse Skills", icon: Search },
    { path: "/requests", label: "My Requests", icon: MessageSquare },
    { path: "/profile", label: "Profile", icon: Settings },
  ];

  const handleAuth = () => {
    if (isLoginMode) {
      // Login validation
      if (!email.trim() || !password.trim()) {
        alert("Please enter both email and password");
        return;
      }

      // Mock login success
      setIsLoggedIn(true);
      setShowAuthModal(false);
      resetForm();
      alert("Login successful!");
    } else {
      // Signup validation
      if (
        !name.trim() ||
        !email.trim() ||
        !password.trim() ||
        !confirmPassword.trim()
      ) {
        alert("Please fill in all fields");
        return;
      }

      if (password !== confirmPassword) {
        alert("Passwords don't match");
        return;
      }

      // Mock signup success
      setIsLoggedIn(true);
      setShowAuthModal(false);
      resetForm();
      alert("Account created successfully!");
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    alert("Logged out successfully!");
  };

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setName("");
  };

  const toggleAuthMode = () => {
    setIsLoginMode(!isLoginMode);
    resetForm();
  };

  const closeModal = () => {
    setShowAuthModal(false);
    resetForm();
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-orange-500 to-red-600">
              <Users className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-bold text-primary">SkillSwap</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-6">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={cn(
                    "flex items-center space-x-1 text-sm font-medium transition-colors hover:text-primary",
                    isActive(item.path)
                      ? "text-primary"
                      : "text-muted-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center space-x-2">
            {isLoggedIn ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="hover:bg-red-50 hover:text-red-600"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline-block ml-1">Logout</span>
              </Button>
            ) : (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowAuthModal(true)}
                className="hover:bg-orange-50 hover:text-orange-600"
              >
                <LogIn className="h-4 w-4" />
                <span className="hidden sm:inline-block ml-1">Login</span>
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-orange-500 to-red-600">
                  <Users className="h-5 w-5 text-white" />
                </div>
                <span className="text-xl font-bold text-orange-600">
                  {isLoginMode ? "Login" : "Sign Up"}
                </span>
              </div>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded-full transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-4">
              {!isLoginMode && (
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Full Name
                  </label>
                  <Input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    className="w-full focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
              )}

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Email
                </label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="w-full focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-gray-700">
                  Password
                </label>
                <Input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                />
              </div>

              {!isLoginMode && (
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Confirm Password
                  </label>
                  <Input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    className="w-full focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
                  />
                </div>
              )}

              <Button
                onClick={handleAuth}
                className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 font-medium"
              >
                {isLoginMode ? "Login" : "Create Account"}
              </Button>

              <div className="text-center pt-2 space-y-2">
                {isLoginMode && (
                  <button className="block w-full text-sm text-orange-600 hover:text-orange-800 hover:underline transition-colors">
                    Forgot username/password?
                  </button>
                )}

                <div className="text-sm text-gray-600">
                  {isLoginMode
                    ? "Don't have an account? "
                    : "Already have an account? "}
                  <button
                    onClick={toggleAuthMode}
                    className="text-orange-600 hover:text-orange-800 hover:underline font-medium transition-colors"
                  >
                    {isLoginMode ? "Sign up" : "Login"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
