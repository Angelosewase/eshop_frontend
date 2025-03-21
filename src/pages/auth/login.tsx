import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { loginUser } from "../../features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "../../hooks/Reduxhooks";
import { toast } from "sonner";
import { useValidatePath } from "../../hooks/auth";

function Login() {
  useValidatePath();
  const navigate = useNavigate();
  const location = useLocation();
  const [formState, setFormState] = useState({
    emailPhoneNumberString: "",
    password: "",
  });

  const dispatch = useAppDispatch();
  const { user, loading, error } = useAppSelector((state) => state.auth);

  function handleFormState(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormState({ ...formState, [name]: value });
  }

  React.useEffect(() => {
    if (user) {
      console.log("User authenticated:", { role: user.role, id: user.id });

      // Navigate based on role and saved location
      const timeoutId = setTimeout(() => {
        if (user.role === "ADMIN") {
          const savedPath = location.state?.from?.pathname;
          const targetPath = savedPath?.startsWith("/admin")
            ? savedPath
            : "/admin";
          console.log("Redirecting admin to:", targetPath);
          navigate(targetPath, { replace: true });
        } else {
          console.log("Redirecting user to home");
          navigate("/", { replace: true });
        }
      }, 500); // Give time for state to settle

      return () => clearTimeout(timeoutId);
    }
  }, [user, navigate, location]);

  React.useEffect(() => {
    const loadingToastId = "login-loading";

    if (loading) {
      toast.loading("Logging in...", { id: loadingToastId });
    } else {
      toast.dismiss(loadingToastId);
      if (error) {
        toast.error(error);
      }
    }

    return () => {
      toast.dismiss(loadingToastId);
    };
  }, [loading, error]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!formState.emailPhoneNumberString || !formState.password) {
      toast.error("Please fill in all fields");
      return;
    }

    try {
      const result = await dispatch(
        loginUser({
          emailPhoneNumberString: formState.emailPhoneNumberString,
          password: formState.password,
        }),
      );

      if (result.meta.requestStatus === "fulfilled") {
        const userData = result.payload;
        console.log("Login successful:", userData);
        toast.success("Login successful!");
      } else if (result.meta.requestStatus === "rejected") {
        const errorMessage =
          (result.payload as { message: string })?.message || "Login failed";
        console.error("Login failed:", errorMessage);
        toast.error(errorMessage);
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("An unexpected error occurred");
    }
  }

  return (
    <div className="w-1/3 h-full items-center pt-[200px] flex flex-col">
      <form onSubmit={handleSubmit} className="w-[70%]">
        <h1 className="text-4xl font-semibold mb-2">E-shop</h1>
        <h2 className="font-semibold">Login using your credentials</h2>

        <div className="mt-6">
          <div className="flex flex-col gap-2 mb-3">
            <label htmlFor="emailPhoneNumber" className="font-semibold">
              Email or Phone Number
            </label>
            <input
              type="text"
              id="emailPhoneNumberString"
              name="emailPhoneNumberString"
              className="border-2 rounded-sm p-2 outline-none border-black placeholder:text-black placeholder:font-light"
              placeholder="Enter email or phone number"
              value={formState.emailPhoneNumberString}
              onChange={handleFormState}
              required
            />
          </div>
          <div className="flex flex-col gap-2 mb-3">
            <label htmlFor="password" className="font-semibold">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter password"
              className="border-2 rounded-sm p-2 outline-none border-black placeholder:text-black placeholder:font-light"
              value={formState.password}
              onChange={handleFormState}
              required
            />
          </div>
        </div>
        <button
          type="submit"
          className="bg-primary text-white text-center text-lg flex items-center justify-center w-full p-3 mt-6 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Logging in..." : "Login"}
        </button>
        <div className="mt-5">
          Don't have an account?{" "}
          <Link to="/auth/signUp" className="text-blue-500">
            Sign up
          </Link>
        </div>
      </form>

      <Link to="/" className="font-bold text-sm mt-auto mb-4 mr-auto ml-[15%]">
        Back to website
      </Link>
      <div>
        <p className="text-sm">&copy; 2021 E-shop. All rights reserved.</p>
      </div>
    </div>
  );
}

export default Login;
