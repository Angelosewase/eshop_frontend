import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../store/store";
import { verifyIsLoggedIn } from "../../features/auth/authSlice";
import { LoadingSpinner } from "../ui/loading-spinner";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const { user, loading } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const verifyAuth = async () => {
      try {
        await dispatch(verifyIsLoggedIn()).unwrap();
      } catch (error) {
        console.error("Auth verification failed:", error);
        // Redirect to login but save the attempted location
        navigate("/auth/login", { state: { from: location } });
      }
    };

    if (!user) {
      verifyAuth();
    }
  }, [dispatch, navigate, location, user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  // If there's no user after loading is complete, redirect to login
  if (!user) {
    console.log("No user found, redirecting to login");
    navigate("/auth/login", { state: { from: location } });
    return null;
  }

  // Check for admin role
  if (user.role !== "ADMIN") {
    console.log("User is not admin, redirecting to home");
    navigate("/", { replace: true });
    return null;
  }

  // If we have a user and they're an admin, render the protected content
  return <>{children}</>;
};
