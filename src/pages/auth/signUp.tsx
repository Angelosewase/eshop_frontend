import { useState } from "react";
import { Link } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../hooks/Reduxhooks";
import { toast } from "sonner";
import { registerUser } from "../../features/auth/authSlice";
import { AxiosError } from "axios";

function SignUp() {
  const dispatch = useAppDispatch();
  const [formState, setFormState] = useState({
    firstName: "",
    lastName: "",
    emailPhoneNumberString: "",
    password: "",
    confirmPassword: "",
  });

  const { user, loading, error } = useAppSelector((state) => state.auth);
  function handleFormState(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target;
    setFormState({ ...formState, [name]: value });
  }

  function validateInputs() {
    const requiredFields = [
      { key: "first name", value: formState.firstName },
      { key: "last name", value: formState.lastName },
      { key: "email or phone number", value: formState.emailPhoneNumberString },
      { key: "password", value: formState.password },
    ];

    const emptyFields = requiredFields
      .filter((field) => !field.value || field.value === "")
      .map((field) => field.key);

    if (emptyFields.length > 0) {
      toast.error("Uh oh! Something went wrong.", {
        description: `Please fill in all the required fields (${emptyFields.join(
          ", "
        )})`,
      });
      return false;
    }

    const emailOrPhoneRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$|^\+?[1-9]\d{1,14}$/;
    if (!emailOrPhoneRegex.test(formState.emailPhoneNumberString)) {
      toast.error("Uh oh! Something went wrong.", {
        description: "Please enter a valid email address or phone number",
      });
      return false;
    }

    if (formState.password !== formState.confirmPassword) {
      toast.error("Uh oh! Something went wrong.", {
        description: "Passwords don't match",
      });
      return false;
    }

    return true;
  }

  if (user != null) {
    toast.success("sign successful!");
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
    console.log(error);
    
  }

  function handleSubmit() {
    if (!validateInputs()) return;
    dispatch(
      registerUser({
        firstName: formState.firstName,
        lastName: formState.lastName,
        emailPhoneNumberString: formState.emailPhoneNumberString,
        password: formState.password,
      })
    );
  }

  return (
    <div className="w-1/3 h-full items-center pt-[50px] flex flex-col">
      <form action="" className="w-[70%]" onSubmit={(e) => e.preventDefault()}>
        <h1 className="text-4xl font-semibold mb-2">E-shop</h1>
        <h2 className="font-semibold">Sign up</h2>

        <div className="mt-4">
          <div className="flex flex-col gap-1 mb-2">
            <label htmlFor="firstName" className="font-semibold">
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              className="border-2 rounded-sm p-2 outline-none border-black placeholder:text-black placeholder:font-light"
              placeholder="John"
              value={formState.firstName}
              onChange={handleFormState}
            />
          </div>
          <div className="flex flex-col gap-1 mb-2">
            <label htmlFor="lastName" className="font-semibold">
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              className="border-2 rounded-sm p-2 outline-none border-black placeholder:text-black placeholder:font-light"
              placeholder="Doe"
              value={formState.lastName}
              onChange={handleFormState}
            />
          </div>
          <div className="flex flex-col gap-1 mb-2">
            <label htmlFor="emailPhoneNumberString" className="font-semibold">
              Email or phone number
            </label>
            <input
              type="text"
              id="emailPhoneNumberString"
              name="emailPhoneNumberString"
              className="border-2 rounded-sm p-2 outline-none border-black placeholder:text-black placeholder:font-light"
              placeholder="johndoe@example.com"
              value={formState.emailPhoneNumberString}
              onChange={handleFormState}
            />
          </div>
          <div className="flex flex-col gap-1 mb-2">
            <label htmlFor="password" className="font-semibold">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              className="border-2 rounded-sm p-2 outline-none border-black placeholder:text-black placeholder:font-light"
              placeholder="*********"
              value={formState.password}
              onChange={handleFormState}
            />
          </div>
          <div className="flex flex-col gap-1 mb-2">
            <label htmlFor="confirmPassword" className="font-semibold">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              className="border-2 rounded-sm p-2 outline-none border-black placeholder:text-black placeholder:font-light"
              placeholder="*********"
              value={formState.confirmPassword}
              onChange={handleFormState}
            />
          </div>
        </div>
        <button
          className="bg-primary text-white text-center text-lg flex items-center justify-center w-full p-3 mt-4"
          onClick={handleSubmit}
        >
          Sign up
        </button>
        <div className="mt-3">
          Already have an account?{" "}
          <Link to={"/auth/login"} className="text-blue-500">
            Log in
          </Link>
        </div>
      </form>

      <Link
        to={"/"}
        className="font-bold text-sm mt-auto mb-3 mr-auto ml-[15%]"
      >
        Back to website
      </Link>
      <div>
        <p className="text-sm">&copy; 2021 E-shop. All rights reserved.</p>
      </div>
    </div>
  );
}

export default SignUp;
