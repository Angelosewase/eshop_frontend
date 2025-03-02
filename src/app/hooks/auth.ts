import { useNavigate } from "react-router-dom";
import { verifyIsLoggedIn } from "../../features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "../hooks/Reduxhooks";
import { useEffect } from "react";

enum Role {
  USER = "USER",
  ADMIN = "ADMIN",
}

export const useIsUserLoggedIn = (): boolean => {
  const user = useAppSelector((state) => state.auth.user);
  return user !== null;
};

export const useHasRole = (role: Role): boolean => {
  const user = useAppSelector((state) => state.auth.user);
  return (user as { role: Role } | null)?.role === role;
};

export const useIsUserAdmin = (): boolean => {
  return useHasRole(Role.ADMIN);
};

export const useValidatePath = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector(state => state.auth.user);
  const isLoggedIn = useIsUserLoggedIn();
  const isUserAdmin = useIsUserAdmin();

  useEffect(() => {
    if (!user) {
      dispatch(verifyIsLoggedIn());
    }
  }, [dispatch, user]);

  useEffect(() => {
    if (isLoggedIn && isUserAdmin) {
      navigate("/admin");
    } else if (isLoggedIn) {
      navigate("/");
    }
  }, [isLoggedIn, isUserAdmin, navigate]);
};
