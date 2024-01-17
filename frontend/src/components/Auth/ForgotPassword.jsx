import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
  const [mailSent, setMailSent] = useState(false);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  async function handleForgotPassword(data) {
    console.log(data);
    try {
      const response = await fetch(
        "http://localhost:5000/api/auth/forgotPassword",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(data),
        }
      );
      if (response.ok) {
        const result = await response.json();

        if (result.message === "Email Sent") {
          setMailSent(true);
          setError(null);
        } else if (result.error === "Email not found") {
          setError(result.error);
          setMailSent(false);
        }
        console.log("Success:", result);
      }
    } catch (e) {
      console.error("Error:", e);
    }
  }

  return (
    <main className="flex flex-col items-center justify-center min-h-screen px-4 bg-gray-50 sm:px-6 lg:px-8">
      <div className="w-full max-w-md p-5 mx-auto bg-white shadow-lg">
        <div className="my-5 space-y-1 ">
          <div className="text-3xl font-bold">Forgot Password</div>
          <p className="text-gray-500">
            Enter your email below to reset your password
          </p>
        </div>
        <div>
          <form
            className="space-y-4"
            noValidate
            onSubmit={handleSubmit((data, e) => {
              e.preventDefault();
              handleForgotPassword(data);
            })}
          >
            <div className="space-y-2">
              <label htmlFor="email">Email</label>
              <input
                id="email"
                placeholder="m@example.com"
                required
                type="email"
                {...register("email", {
                  required: "email is required",
                  pattern: {
                    value: /\b[\w\.-]+@[\w\.-]+\.\w{2,4}\b/gi,
                    message: "email not valid",
                  },
                })}
              />
              {errors.email && (
                <p className="text-red-500">{errors.email.message}</p>
              )}
              {mailSent && <p className="text-green-500">Mail Sent</p>}
              {error && <p className="text-red-500">{error}</p>}
            </div>
            <button
              className="w-full mt-2 bg-[#18181B] hover:bg-[#2c2c31] text-white py-2 rounded-md"
              type="submit"
            >
              Reset Password
            </button>
          </form>
          <div className="my-5 text-center">
            <p className="text-gray-500">
              Remember your password?{" "}
              <Link
                className="text-blue-500 underline hover:text-blue-700"
                to="/login"
              >
                Log in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
