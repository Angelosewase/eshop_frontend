import { User, Pencil, Save, X } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../../components/ui/dialog";
import { Input } from "../../../components/ui/input";
import { Label } from "../../../components/ui/label";
import { useGetCurrentUserQuery, useUpdateUserMutation } from "../../../features/users/userSlice";
import { useAppDispatch } from "../../../hooks/Reduxhooks";
import { logOut } from "../../../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { LoadingSpinner } from "../../../components/ui/loading-spinner";

function ProfileModal() {
  const { data: userData, isLoading } = useGetCurrentUserQuery();
  const [updateUser] = useUpdateUserMutation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phoneNumber: "",
  });
  
  useEffect(() => {
    if (userData) {
      setFormData({
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
        phoneNumber: userData.phoneNumber || "",
      });
    }
  }, [userData]);

  const handleLogout = async () => {
    try {
      await dispatch(logOut()).unwrap();
      toast.success("Logged out successfully");
      navigate("/auth/login");
    } catch (error) {
      toast.error("Failed to logout");
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    try {
      if (!userData?.id) {
        toast.error("User ID not found");
        return;
      }
      await updateUser({ id: userData.id, data: formData }).unwrap();
      toast.success("Profile updated successfully");
      setIsEditing(false);
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };

  const handleCancel = () => {
    setFormData({
      firstName: userData?.firstName || "",
      lastName: userData?.lastName || "",
      phoneNumber: userData?.phoneNumber || "",
    });
    setIsEditing(false);
  };

  if (isLoading) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <button className="hover:bg-cyan-400 p-2 rounded-full">
            <User size={15} />
          </button>
        </DialogTrigger>
        <DialogContent>
          <div className="h-32">
            <LoadingSpinner size="lg" />
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="hover:bg-cyan-400 p-2 rounded-full">
          <User size={15} />
        </button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">
            Your Profile
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-xl font-semibold">
              {userData?.firstName?.[0]?.toUpperCase()}
              {userData?.lastName?.[0]?.toUpperCase()}
            </div>
            <div>
              <h3 className="text-lg font-semibold">
                {userData?.firstName} {userData?.lastName}
              </h3>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <Label htmlFor="firstName">First Name</Label>
              <div className="flex gap-2">
                <Input
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="p-2 hover:bg-gray-100 rounded-md"
                    title="Edit"
                  >
                    <Pencil size={16} />
                  </button>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="lastName">Last Name</Label>
              <div className="flex gap-2">
                <Input
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <div className="flex gap-2">
                <Input
                  id="phoneNumber"
                  name="phoneNumber"
                  value={formData.phoneNumber}
                  onChange={handleInputChange}
                  disabled={!isEditing}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                value={userData?.email || "Not provided"}
                disabled
              />
            </div>

            {isEditing && (
              <div className="flex gap-2 justify-end mt-4">
                <button
                  onClick={handleCancel}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-md flex items-center gap-2"
                >
                  <X size={16} />
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 flex items-center gap-2"
                >
                  <Save size={16} />
                  Save Changes
                </button>
              </div>
            )}
          </div>

          <div className="pt-4 border-t">
            <button
              onClick={handleLogout}
              className="w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600 transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default ProfileModal; 