import React from "react";
import { useGetCurrentUserQuery } from "../../features/users/userSlice";
import { useNavigate } from "react-router-dom";
import ProfileHeader from "../../components/custom/ProfileHeader";
import PersonalInfo from "../../components/custom/Persona-info";
import PrivacyControls from "../../components/custom/private-controls";
import CommunicationPreferences from "../../components/custom/CommunicationPref";
import SecuritySettings from "../../components/custom/SecuitySettings";

export default function Profile() {
  const { data: userData, error, isLoading } = useGetCurrentUserQuery();
  const navigate = useNavigate();

  React.useEffect(() => {
    console.log("Current API Response:", {
      userData,
      dataKeys: userData ? Object.keys(userData) : [],
    });
  }, [userData]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <strong className="font-bold">Error! </strong>
          <span className="block sm:inline">Failed to load profile data.</span>
        </div>
      </div>
    );
  }

  if (!userData || !userData.id) {
    return (
      <div className="min-h-screen flex items-center justify-center mx-auto ">
        <div
          className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <strong className="font-bold">Notice: </strong>
          <span className="block sm:inline">
            No user data found. Please log in.
          </span>
          <button
            onClick={() => navigate("/auth/login")}
            className="mt-2 bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600 transition-colors"
          >
            Go to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30 flex items-center justify-center ">
      <div className="container max-w-4xl py-12 px-4 sm:px-6 ">
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight mb-2 text-center">
            Your Profile
          </h1>
          <p className="text-muted-foreground text-center">
            Manage your account settings and preferences
          </p>
        </div>

        <ProfileHeader
          name={`${userData.firstName} ${userData.lastName}`}
          email={userData.email || ""}
          profileImage={userData.firstName || ""}
        />

        <PersonalInfo
          firstName={userData.firstName || "unknown"}
          lastName={userData.lastName || "unknown"}
          email={userData.email || "unkown"}
          phone={"unknown"}
          birthdate={"unknown"}
        />

        <SecuritySettings />

        <PrivacyControls />

        <CommunicationPreferences />

        <footer className="mt-16 text-center text-xs text-muted-foreground">
          <p>© 2025 YourStore. All rights reserved.</p>
          <div className="mt-2 space-x-4">
            <a href="#" className="hover:underline">
              Privacy Policy
            </a>
            <a href="#" className="hover:underline">
              Terms of Service
            </a>
            <a href="#" className="hover:underline">
              Contact Support
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
}
