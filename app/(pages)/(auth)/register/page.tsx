"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";

const registerSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Password must include at least one uppercase letter")
    .regex(/\d/, "Password must include at least one digit")
    .regex(
      /[^A-Za-z0-9]/,
      "Password must include at least one special character",
    ),
});

export default function RegisterPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [errorMsg, setErrorMsg] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setErrorMsg("");
    setSuccessMsg("");
    setIsLoading(true);

    const validationResult = registerSchema.safeParse({ email, password });
    if (!validationResult.success) {
      const allErrors = validationResult.error.issues
        .map((issue) => issue.message)
        .join("\n");
      setErrorMsg(allErrors);
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user: {
            email,
            password,
          },
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setErrorMsg(data.message || "Something went wrong. Please try again.");
        setIsLoading(false);
        return;
      }

      setSuccessMsg(
        data.message || "Account created successfully! Redirecting to login...",
      );

      // Short delay before redirecting to login
      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } catch (err) {
      setErrorMsg("An unexpected error occurred. Please try again.");
      setIsLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex flex-1 items-center justify-center bg-gradient-to-br from-blue-50 to-white p-4 text-gray-800">
      <div className="mx-auto w-full max-w-md rounded-lg border border-gray-200 bg-white p-8 shadow-xl">
        <h1 className="mb-6 text-center text-3xl font-bold text-indigo-900">
          Create Account
        </h1>

        {successMsg && (
          <div className="mb-4 rounded-md border border-green-300 bg-green-100 p-3 text-green-700">
            <p className="flex items-center">
              <svg
                className="mr-2 h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              {successMsg}
            </p>
          </div>
        )}

        {errorMsg && (
          <div className="mb-4 rounded-md border border-red-300 bg-red-100 p-3 text-red-700">
            <p className="flex items-start">
              <svg
                className="mt-0.5 mr-2 h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                />
              </svg>
              <span className="whitespace-pre-line">{errorMsg}</span>
            </p>
          </div>
        )}

        <form className="flex flex-col space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-1">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <svg
                  className="h-5 w-5 text-blue-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  />
                </svg>
              </div>
              <input
                id="email"
                type="email"
                className="block w-full rounded-md border border-gray-300 bg-gray-50 p-3 pl-10 placeholder-gray-400 transition-all focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <div className="relative">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                <svg
                  className="h-5 w-5 text-blue-500"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                className="block w-full rounded-md border border-gray-300 bg-gray-50 p-3 pr-10 pl-10 placeholder-gray-400 transition-all focus:border-transparent focus:ring-2 focus:ring-blue-500 focus:outline-none"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Create a strong password"
                aria-describedby="password-requirements"
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 flex items-center pr-3"
                onClick={togglePasswordVisibility}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? (
                  <svg
                    className="h-5 w-5 text-gray-500 hover:text-blue-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M3 3l3.59 3.59"
                    />
                  </svg>
                ) : (
                  <svg
                    className="h-5 w-5 text-gray-500 hover:text-blue-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                )}
              </button>
            </div>
            <div
              id="password-requirements"
              className="mt-2 space-y-1 text-xs text-gray-500"
            >
              <p>Password must have:</p>
              <ul className="ml-4 space-y-1">
                <li className="flex items-center">
                  <span
                    className={`mr-1 text-xs ${password.length >= 8 ? "text-green-600" : "text-gray-400"}`}
                  >
                    {password.length >= 8 ? "✓" : "○"}
                  </span>
                  At least 8 characters
                </li>
                <li className="flex items-center">
                  <span
                    className={`mr-1 text-xs ${/[A-Z]/.test(password) ? "text-green-600" : "text-gray-400"}`}
                  >
                    {/[A-Z]/.test(password) ? "✓" : "○"}
                  </span>
                  One uppercase letter
                </li>
                <li className="flex items-center">
                  <span
                    className={`mr-1 text-xs ${/\d/.test(password) ? "text-green-600" : "text-gray-400"}`}
                  >
                    {/\d/.test(password) ? "✓" : "○"}
                  </span>
                  One number
                </li>
                <li className="flex items-center">
                  <span
                    className={`mr-1 text-xs ${/[^A-Za-z0-9]/.test(password) ? "text-green-600" : "text-gray-400"}`}
                  >
                    {/[^A-Za-z0-9]/.test(password) ? "✓" : "○"}
                  </span>
                  One special character
                </li>
              </ul>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="flex w-full items-center justify-center rounded-md border border-transparent bg-indigo-700 px-4 py-3 font-semibold text-white shadow-md transition-all hover:bg-indigo-800 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-white focus:outline-none disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isLoading ? (
              <>
                <svg
                  className="mr-2 -ml-1 h-4 w-4 animate-spin text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Creating Account...
              </>
            ) : (
              "Create Account"
            )}
          </button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">
            Already have an account?
            <button
              onClick={() => router.push("/login")}
              className="ml-1 font-medium text-blue-600 transition-colors hover:text-blue-700"
            >
              Sign In
            </button>
          </p>
        </div>

        <div className="mt-6 border-t border-gray-200 pt-5">
          <p className="text-center text-xs text-gray-500">
            By creating an account, you agree to our{" "}
            <a href="#" className="text-blue-600 underline hover:text-blue-700">
              Terms of Service
            </a>{" "}
            and{" "}
            <a href="#" className="text-blue-600 underline hover:text-blue-700">
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  );
}
