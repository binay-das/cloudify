"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Link from "next/link";
import {
  Cloud,
  Mail,
  Lock,
  User,
  ArrowRight,
  Eye,
  EyeOff,
  CheckCircle,
  Sparkles,
  Shield,
  Zap,
  Users,
  Globe,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import Navbar from "@/components/layout/Navbar";

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

const staggerChildren = {
  animate: {
    transition: {
      staggerChildren: 0.1,
    },
  },
};

export default function SignUpPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });

    if (name === "password") {
      let strength = 0;
      if (value.length >= 8) strength++;
      if (/[A-Z]/.test(value)) strength++;
      if (/[0-9]/.test(value)) strength++;
      if (/[^A-Za-z0-9]/.test(value)) strength++;
      setPasswordStrength(strength);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!form.name.trim() || !form.email.trim() || !form.password.trim()) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    if (form.password.length < 6) {
      setError("Password must be at least 6 characters long");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/register", {
        method: "POST",
        body: JSON.stringify(form),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Something went wrong");
        setLoading(false);
        return;
      }

      router.push("/signin");
    } catch (err) {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  };

  const getPasswordStrengthColor = (strength: number) => {
    if (strength === 0) return "bg-gray-200 dark:bg-gray-700";
    if (strength === 1) return "bg-red-400";
    if (strength === 2) return "bg-yellow-400";
    if (strength === 3) return "bg-blue-400";
    return "bg-green-400";
  };

  const getPasswordStrengthText = (strength: number) => {
    if (strength === 0) return "";
    if (strength === 1) return "Weak";
    if (strength === 2) return "Fair";
    if (strength === 3) return "Good";
    return "Strong";
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <Navbar />
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-100 dark:from-gray-950 dark:via-gray-900 dark:to-gray-950">
        <div className="absolute inset-0 opacity-20">
          <svg
            className="absolute top-0 left-0 w-full h-full"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <pattern
                id="grid"
                width="60"
                height="60"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M 60 0 L 0 0 0 60"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1"
                  className="text-gray-300 dark:text-gray-700"
                />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-r from-blue-400/30 to-purple-400/30 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-r from-purple-400/20 to-pink-400/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-r from-cyan-400/20 to-blue-400/20 rounded-full blur-3xl"></div>

        <div className="absolute top-32 right-1/4 animate-float">
          <div className="w-4 h-4 bg-blue-500/20 rounded-full"></div>
        </div>
        <div
          className="absolute bottom-32 left-1/4 animate-float"
          style={{ animationDelay: "2s" }}
        >
          <div className="w-6 h-6 bg-purple-500/20 rounded-full"></div>
        </div>
        <div
          className="absolute top-1/2 right-32 animate-float"
          style={{ animationDelay: "1s" }}
        >
          <div className="w-3 h-3 bg-pink-500/20 rounded-full"></div>
        </div>
      </div>

      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <motion.div
          initial="initial"
          animate="animate"
          variants={staggerChildren}
          className="w-full max-w-md"
        >
          <motion.div variants={fadeInUp}>
            <Card className="backdrop-blur-xl bg-white/90 dark:bg-gray-900/90 border border-gray-200/50 dark:border-gray-700/50 shadow-2xl overflow-hidden">
              <CardHeader className="p-0 text-center">
                <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                  Create your account
                </CardTitle>
                <CardDescription className="text-gray-600 dark:text-gray-300 mt-2">
                  Start your cloud journey with enterprise-grade security
                </CardDescription>
              </CardHeader>

              <CardContent className="p-6 space-y-6">
                <form onSubmit={handleSubmit} className="space-y-5">
                  <motion.div variants={fadeInUp} className="space-y-2">
                    <label
                      htmlFor="name"
                      className="text-sm font-semibold text-gray-700 dark:text-gray-300"
                    >
                      Full Name
                    </label>
                    <div className="relative group">
                      <User className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                      <Input
                        id="name"
                        name="name"
                        type="text"
                        placeholder="Enter your full name"
                        className="pl-12 h-12 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 rounded-xl transition-all duration-200"
                        value={form.name}
                        onChange={handleChange}
                        required
                        disabled={loading}
                      />
                    </div>
                  </motion.div>

                  <motion.div variants={fadeInUp} className="space-y-2">
                    <label
                      htmlFor="email"
                      className="text-sm font-semibold text-gray-700 dark:text-gray-300"
                    >
                      Email Address
                    </label>
                    <div className="relative group">
                      <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="Enter your email"
                        className="pl-12 h-12 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 rounded-xl transition-all duration-200"
                        value={form.email}
                        onChange={handleChange}
                        required
                        disabled={loading}
                      />
                    </div>
                  </motion.div>

                  <motion.div variants={fadeInUp} className="space-y-2">
                    <label
                      htmlFor="password"
                      className="text-sm font-semibold text-gray-700 dark:text-gray-300"
                    >
                      Password
                    </label>
                    <div className="relative group">
                      <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                      <Input
                        id="password"
                        name="password"
                        type={showPassword ? "text" : "password"}
                        placeholder="Create a strong password"
                        className="pl-12 pr-12 h-12 bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-600 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 rounded-xl transition-all duration-200"
                        value={form.password}
                        onChange={handleChange}
                        required
                        disabled={loading}
                      />
                      <button
                        type="button"
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff /> : <Eye />}
                      </button>
                    </div>

                    {form.password && (
                      <div className="space-y-3 mt-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200/50 dark:border-gray-700/50">
                        <div className="flex gap-1">
                          {[...Array(4)].map((_, i) => (
                            <div
                              key={i}
                              className={`h-2 flex-1 rounded-full transition-all duration-300 ${
                                i < passwordStrength
                                  ? getPasswordStrengthColor(passwordStrength)
                                  : "bg-gray-200 dark:bg-gray-700"
                              }`}
                            ></div>
                          ))}
                        </div>
                        {passwordStrength > 0 && (
                          <p className="text-xs text-gray-600 dark:text-gray-400 flex items-center gap-2">
                            <Shield className="w-3 h-3" />
                            Password strength:{" "}
                            <span className="font-semibold">
                              {getPasswordStrengthText(passwordStrength)}
                            </span>
                          </p>
                        )}
                      </div>
                    )}
                  </motion.div>

                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded-xl border border-red-200 dark:border-red-800"
                    >
                      {error}
                    </motion.div>
                  )}

                  <motion.div variants={fadeInUp}>
                    <Button
                      type="submit"
                      className="w-full h-13 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 hover:from-blue-700 hover:via-purple-700 hover:to-pink-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                      disabled={
                        loading || !form.name || !form.email || !form.password
                      }
                    >
                      {loading ? (
                        <div className="flex items-center gap-2">
                          <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                          Creating account...
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <Sparkles className="h-5 w-5" />
                          Create Account
                          <ArrowRight className="h-5 w-5" />
                        </div>
                      )}
                    </Button>
                  </motion.div>
                </form>

                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-200 dark:border-gray-600"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white dark:bg-gray-900 text-gray-500 dark:text-gray-400 font-medium">
                      Already have an account?
                    </span>
                  </div>
                </div>

                <motion.div variants={fadeInUp}>
                  <Link href="/signin">
                    <Button
                      variant="outline"
                      className="w-full h-12 border-2 border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-800 rounded-xl font-semibold transition-all duration-200 hover:border-blue-300 dark:hover:border-blue-600"
                    >
                      Sign in to existing account
                    </Button>
                  </Link>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>

          <motion.div variants={fadeInUp} className="text-center mt-6">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Need help?{" "}
              <Link
                href="/contact"
                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium"
              >
                Contact Support
              </Link>
            </p>
          </motion.div>
        </motion.div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }
        .animate-float {
          animation: float 6s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
