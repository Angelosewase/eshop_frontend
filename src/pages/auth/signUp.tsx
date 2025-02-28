import { Link } from "react-router-dom";

function signUp() {
  return (
    <div className="w-1/3 h-full items-center pt-[50px] flex flex-col">
      <form action="" className="w-[70%]">
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
            />
          </div>
          <div className="flex flex-col gap-1 mb-2">
            <label htmlFor="email" className="font-semibold">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              className="border-2 rounded-sm p-2 outline-none border-black placeholder:text-black placeholder:font-light"
              placeholder="johndoe@example.com"
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
            />
          </div>
        </div>
        <button className="bg-primary text-white text-center text-lg flex items-center justify-center w-full p-3 mt-4">
          Sign up
        </button>
        <div className="mt-3">
          Already have an account?{" "}
          <Link to={"/auth/login"} className="text-blue-500">
            Log in
          </Link>
        </div>
      </form>

      <Link to={"/"} className="font-bold text-sm mt-auto mb-3 mr-auto ml-[15%]">
        Back to website
      </Link>
      <div>
        <p className="text-sm">&copy; 2021 E-shop. All rights reserved.</p>
      </div>
    </div>
  );
}

export default signUp;

