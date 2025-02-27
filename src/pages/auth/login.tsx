function Login() {
  return (
    <div className="flex h-screen min-h-screen">
      <div className="w-1/3 h-full items-center pt-[200px]  flex flex-col">
        <form action="" className="w-[70%]">
          <h1 className="text-4xl font-semibold mb-2">E-shop</h1>
          <h2 className="font-semibold">E-shop Admin login </h2>

          <div className="mt-6">
            <div className="flex flex-col gap-2 mb-3">
              <label htmlFor="email" className="font-semibold">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="border-2 rounded-sm p-2 outline-none border-black placeholder:text-black placeholder:font-light  "
                placeholder="admin@eshopp.com"
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
              />
            </div>
          </div>
          <button className="bg-primary text-white text-center text-lg flex items-center justify-center w-full p-3 mt-6  ">
            Login
          </button>
        </form>

        <a className="font-bold text-sm mt-auto mb-4  mr-auto ml-[15%]">Back to website</a>
      </div>
      <div className="flex-1 border border-green-500 h-full"></div>
    </div>
  );
}

export default Login;
