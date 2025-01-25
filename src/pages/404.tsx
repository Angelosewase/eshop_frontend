import { useLocation } from "react-router-dom";

export default function Page404() {
  const location = useLocation();
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-6xl font-bold">404 - Page Not Found</h1>
      <p className="text-xl">
        The page <code>{location.pathname}</code> could not be found.
      </p>
    </div>
  );
}
