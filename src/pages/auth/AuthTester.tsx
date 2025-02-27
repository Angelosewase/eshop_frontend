import { Outlet } from "react-router-dom";
function AuthTester() {
  //todo :Check of the user is authenticated and redirect to the specific routes

  //else render the login or sigup
  return (
    <>
      <Outlet />
    </>
  );
}

export default AuthTester;
