import { Outlet } from "react-router-dom";
function AuthTester() {
  //todo :Check of the user is authenticated and redirect to the specific routes

  //else render the login or sigup
  return (
    <div className="flex h-screen min-h-screen">
      <Outlet />
      <div className="flex-1  h-full relative">
        <img src="/auth_image.png" alt="" className="w-full h-full" />
        <div className="absolute bottom-10 left-10 right-20  bg-opacity-10 p-4 rounded-lg bg-white text-white ">
          <h1 className="text-xl font-bold mb-5">System Administration</h1>
          <p className="">
            Lorem, ipsum dolor sit amet consectetur adipisicing elit. Dolores,
            non incidunt commodi unde voluptas iusto? Accusantium optio tempora
            non sunt consectetur, ad perferendis unde. Adipisci eius tempore
            similique ea dolore.
          </p>
        </div>
      </div>
    </div>
  );
}

export default AuthTester;
