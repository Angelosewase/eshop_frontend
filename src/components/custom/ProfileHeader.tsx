import React from "react";
import { Button } from "../ui/button";
import { LogOut } from "lucide-react";
import { toast } from "sonner";
import ProfileImage from "../ui-elements/Profile-Image";
import { logOut } from "../../features/auth/authSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import cartService from "../../features/cart/cartService";
import { AppDispatch } from "../../store/store";

interface ProfileHeaderProps {
  name: string;
  email: string;
  profileImage?: string;
}

const ProfileHeader: React.FC<ProfileHeaderProps> = ({
  name,
  email,
  profileImage,
}) => {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const handleProfileImageChange = (file: File) => {
    console.log("Profile image changed:", file);
    toast.message("Profile image changed");
  };

  const handleLogout = async () => {
    try {
      await cartService.clearCart();
      await dispatch(logOut());

      toast.success("Successfully logged out");

      navigate("/auth/login");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to log out. Please try again.");
    }
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between glass-card p-6 mb-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row items-center">
        <ProfileImage
          src={profileImage}
          size="lg"
          onImageChange={handleProfileImageChange}
          className="mb-4 sm:mb-0 sm:mr-6"
        />
        <div className="text-center sm:text-left">
          <h1 className="text-2xl font-medium">{name}</h1>
          <p className="text-muted-foreground">{email}</p>
        </div>
      </div>
      <Button
        variant="outline"
        size="sm"
        className="mt-4 sm:mt-0"
        onClick={handleLogout}
      >
        <LogOut className="mr-2 h-4 w-4" />
        Sign Out
      </Button>
    </div>
  );
};

export default ProfileHeader;

