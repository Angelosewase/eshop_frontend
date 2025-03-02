import React, { useState } from "react";
import { Link } from "react-router-dom";
import { loginUser } from "../../features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "../../app/hooks/Reduxhooks";
import { toast } from "sonner";
import { AxiosError } from "axios";
import {
  useValidatePath,
} from "../../app/hooks/auth";

function Login() {
  useValidatePath();
  const [formState, setFormState] = useState({
    emailPhoneNumber: "",
    password: "",
  });
  const dispatch = useAppDispatch();
  const { user, loading, error } = useAppSelector((state) => state.auth);
  function handleFormState(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormState({ ...formState, [name]: value });
  }
  
  if (user != null) {
    toast.success("Login successful!");
  }
  if (loading) {
    toast.dismiss();
    toast.message("Loading...");
  } else if (error) {
    toast.dismiss();
    toast.error("Uh oh! Something went wrong.", {
      description:
        "There was a problem with your request." +
        (error as AxiosError).message,
    });
  }

  function handleSubmit() {
    dispatch(loginUser(formState));
  }

  return (
    <div className="w-1/3 h-full items-center pt-[200px]  flex flex-col">
      <form onSubmit={(e) => e.preventDefault()} className="w-[70%]">
        <h1 className="text-4xl font-semibold mb-2">E-shop</h1>
        <h2 className="font-semibold"> login using your credentials </h2>

        <div className="mt-6">
          <div className="flex flex-col gap-2 mb-3">
            <label htmlFor="email" className="font-semibold">
              Email
            </label>
            <input
              type="text"
              id="emailPhoneNumber"
              name="emailPhoneNumber"
              className="border-2 rounded-sm p-2 outline-none border-black placeholder:text-black placeholder:font-light  "
              placeholder="Enter email or phone number"
              value={formState.emailPhoneNumber}
              onChange={handleFormState}
            />
          </div>
          <div className="flex flex-col gap-2 mb-3">
            <label htmlFor="password" className="font-semibold">
              password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="enter password"
              className="border-2 rounded-sm p-2 outline-none border-black placeholder:text-black placeholder:font-light "
              value={formState.password}
              onChange={handleFormState}
            />
          </div>
        </div>
        <button
          className="bg-primary text-white text-center text-lg flex items-center justify-center w-full p-3 mt-6  "
          onClick={handleSubmit}
        >
          Login
        </button>
        <div className="mt-5">
          Doesn't have an account?{" "}
          <Link to={"/auth/signUp"} className="text-blue-500">
            Sign up
          </Link>
        </div>
      </form>

      <Link
        to={"/"}
        className="font-bold text-sm mt-auto mb-4  mr-auto ml-[15%]"
      >
        Back to website
      </Link>
      <div>
        <p className="text-sm">&copy; 2021 E-shop. All rights reserved.</p>
      </div>
    </div>
  );
}

export default Login;
