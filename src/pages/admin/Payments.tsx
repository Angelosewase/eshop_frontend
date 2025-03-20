import { FolderX, Search, Filter, Calendar, User, Mail, Phone, Lock, Shield, Calendar as CalendarIcon, Clock, Edit, Save, X } from "lucide-react";
import { useState, useEffect } from "react";
import { AddCardModal, ViewPaymentModal } from "../../components/custom/modals";
import { useGetCurrentUserQuery, useUpdateUserMutation } from "../../features/users/userSlice";
import { useGetPaymentsQuery } from "../../features/payments/paymentsSlice";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "../../components/ui/select";
import { Payment } from "../../features/payments/paymentsSlice";
import { Badge } from "../../components/ui/badge";
import { format } from "date-fns";
import { toast } from "sonner";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";

export default function Payments() {
  const [tabState, setTabState] = useState<"accounts" | "payments" | "transactions">("transactions");
  const { data: userData } = useGetCurrentUserQuery();

  return (
    <div>
      <div className="w-full py-3 items-center px-2">
        <h1 className="text-3xl font-bold">Payments</h1>
      </div>
      <TopTapComponent setState={setTabState} activeTab={tabState} />
      <TabComponent tab={tabState} />
    </div>
  );
}

export const TopTapComponent = ({
  setState,
  activeTab
}: {
  setState: (val: "accounts" | "payments" | "transactions") => void;
  activeTab: "accounts" | "payments" | "transactions";
}) => {
  return (
    <div className="flex justify-between w-[95%] mt-5 mx-auto bg-white shadow-lg shadow-gray-100 gap-10">
      <button
        className={`py-5 flex-1 text-center text-xl font-medium border-b-4 ${activeTab === "accounts" ? "border-blue-500" : "border-white hover:border-blue-500"
          }`}
        onClick={() => setState("accounts")}
      >
        Accounts
      </button>
      <div className="border-2 border-gray-300 my-1"></div>
      <button
        className={`py-5 flex-1 text-center text-xl font-medium border-b-4 ${activeTab === "payments" ? "border-blue-500" : "border-white hover:border-blue-500"
          }`}
        onClick={() => setState("payments")}
      >
        Payment Methods
      </button>
      <div className="border-2 border-gray-300 my-1"></div>
      <button
        className={`py-5 flex-1 text-center text-xl font-medium border-b-4 ${activeTab === "transactions" ? "border-blue-500" : "border-white hover:border-blue-500"
          }`}
        onClick={() => setState("transactions")}
      >
        Transactions
      </button>
    </div>
  );
};

const TabComponent = ({ tab }: { tab: "accounts" | "payments" | "transactions" }) => {
  const { data } = useGetCurrentUserQuery();

  if (tab === "accounts") {
    return <AccountsTab userData={data} />;
  } else if (tab === "payments") {
    return <PaymentMethodsTab />;
  } else {
    return <TransactionsTab />;
  }
};

function AccountsTab({ userData }: { userData: any }) {
  const [updateUser, { isLoading: isUpdating }] = useUpdateUserMutation();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    firstName: userData?.firstName || "",
    lastName: userData?.lastName || "",
    phoneNumber: userData?.phoneNumber || "",
  });

  // Update form data when userData changes
  useEffect(() => {
    if (userData) {
      setFormData({
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
        phoneNumber: userData.phoneNumber || "",
      });
    }
  }, [userData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    if (!userData) return;

    try {
      await updateUser({
        id: userData.id,
        data: formData
      }).unwrap();

      toast.success("Profile updated successfully");
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update profile:", error);
      toast.error("Failed to update profile");
    }
  };

  const handleCancel = () => {
    // Reset form data to original values
    if (userData) {
      setFormData({
        firstName: userData.firstName || "",
        lastName: userData.lastName || "",
        phoneNumber: userData.phoneNumber || "",
      });
    }
    setIsEditing(false);
  };

  if (!userData) {
    return (
      <div className="w-[95%] mx-auto bg-white mt-8 rounded-lg p-8 text-center">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mb-4"></div>
        <p>Loading user information...</p>
      </div>
    );
  }

  return (
    <div className="w-[95%] mx-auto mt-8">
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card className="border border-gray-100 shadow-sm">
            <CardHeader className="bg-gray-50 border-b border-gray-100">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-2xl text-gray-800">Profile Information</CardTitle>
                  <CardDescription className="text-gray-600">
                    Manage your personal information and contact details
                  </CardDescription>
                </div>
                {!isEditing ? (
                  <Button
                    variant="outline"
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 bg-white hover:bg-gray-50 border-gray-200"
                  >
                    <Edit size={16} />
                    Edit Profile
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={handleCancel}
                      className="flex items-center gap-2 bg-white hover:bg-gray-50 border-gray-200"
                    >
                      <X size={16} />
                      Cancel
                    </Button>
                    <Button
                      onClick={handleSave}
                      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
                      disabled={isUpdating}
                    >
                      {isUpdating ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      ) : (
                        <Save size={16} />
                      )}
                      Save Changes
                    </Button>
                  </div>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-8 p-6">
              <div className="flex items-center justify-center mb-6">
                <div className="relative">
                  <div className="w-24 h-24 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-2xl font-bold border-2 border-blue-200">
                    {userData.firstName && userData.lastName
                      ? `${userData.firstName.charAt(0)}${userData.lastName.charAt(0)}`
                      : userData.email?.charAt(0).toUpperCase() || "U"}
                  </div>
                  {!isEditing ? (
                    <button className="absolute bottom-0 right-0 bg-gray-100 hover:bg-gray-200 p-2 rounded-full border border-gray-300 text-gray-600 transition-colors duration-200">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 16l4 4 4-4" /><path d="M22 8l-4-4-4 4" /><path d="M6 20v-4" /><path d="M18 4v4" /><path d="M15 7H9" /><path d="M9 17h6" /></svg>
                    </button>
                  ) : null}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-700 border-b pb-2">Personal Details</h3>

                  <div className="space-y-3">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-gray-500 text-sm">
                        <User size={16} />
                        <span>First Name</span>
                      </div>
                      {isEditing ? (
                        <Input
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleInputChange}
                          placeholder="Enter your first name"
                          className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        />
                      ) : (
                        <div className="p-2 bg-gray-50 rounded-md border border-gray-100">
                          <p className="text-lg font-medium text-gray-800">{userData.firstName || "Not set"}</p>
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-gray-500 text-sm">
                        <User size={16} />
                        <span>Last Name</span>
                      </div>
                      {isEditing ? (
                        <Input
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleInputChange}
                          placeholder="Enter your last name"
                          className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        />
                      ) : (
                        <div className="p-2 bg-gray-50 rounded-md border border-gray-100">
                          <p className="text-lg font-medium text-gray-800">{userData.lastName || "Not set"}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-700 border-b pb-2">Contact Information</h3>

                  <div className="space-y-3">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-gray-500 text-sm">
                        <Mail size={16} />
                        <span>Email Address</span>
                        <Badge className="ml-1 bg-green-100 text-green-800 hover:bg-green-100">Verified</Badge>
                      </div>
                      <div className="p-2 bg-gray-50 rounded-md border border-gray-100 flex justify-between items-center">
                        <p className="text-lg font-medium text-gray-800">{userData.email || "Not set"}</p>
                        <span className="text-xs text-gray-500 italic">Primary</span>
                      </div>
                      <p className="text-xs text-gray-500">Email cannot be changed</p>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-gray-500 text-sm">
                        <Phone size={16} />
                        <span>Phone Number</span>
                      </div>
                      {isEditing ? (
                        <Input
                          name="phoneNumber"
                          value={formData.phoneNumber}
                          onChange={handleInputChange}
                          placeholder="Enter your phone number"
                          className="border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                        />
                      ) : (
                        <div className="p-2 bg-gray-50 rounded-md border border-gray-100">
                          <p className="text-lg font-medium text-gray-800">{userData.phoneNumber || "Not set"}</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-gray-100">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-700 border-b pb-2">Account Information</h3>

                  <div className="space-y-3">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-gray-500 text-sm">
                        <Shield size={16} />
                        <span>Account Type</span>
                      </div>
                      <div className="p-2 bg-gray-50 rounded-md border border-gray-100">
                        <Badge className={userData.role === 'ADMIN' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'}>
                          {userData.role}
                        </Badge>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-gray-500 text-sm">
                        <CalendarIcon size={16} />
                        <span>Member Since</span>
                      </div>
                      <div className="p-2 bg-gray-50 rounded-md border border-gray-100">
                        <p className="text-lg font-medium text-gray-800">
                          {userData.createdAt ? format(new Date(userData.createdAt), 'MMMM dd, yyyy') : "Unknown"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-700 border-b pb-2">Account Status</h3>

                  <div className="p-4 bg-green-50 rounded-md border border-green-100">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-green-100 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
                      </div>
                      <div>
                        <h4 className="font-medium text-green-800">Your account is active</h4>
                        <p className="text-sm text-green-700">All services are available</p>
                      </div>
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50 rounded-md border border-blue-100">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-blue-100 rounded-full">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600"><circle cx="12" cy="12" r="10"></circle><path d="M12 16v-4"></path><path d="M12 8h.01"></path></svg>
                      </div>
                      <div>
                        <h4 className="font-medium text-blue-800">Complete your profile</h4>
                        <p className="text-sm text-blue-700">Add more details to enhance your experience</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card className="border border-gray-100 shadow-sm">
            <CardHeader className="bg-gray-50 border-b border-gray-100">
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle className="text-2xl text-gray-800">Security Settings</CardTitle>
                  <CardDescription className="text-gray-600">
                    Manage your password and security preferences
                  </CardDescription>
                </div>
                <Button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-shield-check"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" /><path d="m9 12 2 2 4-4" /></svg>
                  Security Checkup
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-8 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-700 border-b pb-2">Account Security</h3>

                  <div className="space-y-6">
                    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                      <div className="p-4 flex justify-between items-center">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-blue-100 rounded-full mt-1">
                            <Lock size={18} className="text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-800">Password</h3>
                            <p className="text-sm text-gray-500">Last changed: Never</p>
                          </div>
                        </div>
                        <Button variant="outline" className="bg-white hover:bg-gray-50 border-gray-200">
                          Change Password
                        </Button>
                      </div>
                      <div className="bg-yellow-50 px-4 py-2 border-t border-yellow-100">
                        <div className="flex items-center gap-2 text-yellow-700">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-alert-triangle"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" /><path d="M12 9v4" /><path d="M12 17h.01" /></svg>
                          <span className="text-sm">We recommend changing your password regularly</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                      <div className="p-4 flex justify-between items-center">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-purple-100 rounded-full mt-1">
                            <Shield size={18} className="text-purple-600" />
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-800">Two-Factor Authentication</h3>
                            <p className="text-sm text-gray-500">Enhance your account security</p>
                          </div>
                        </div>
                        <Button variant="outline" className="bg-white hover:bg-gray-50 border-gray-200">
                          Set Up
                        </Button>
                      </div>
                      <div className="bg-red-50 px-4 py-2 border-t border-red-100">
                        <div className="flex items-center gap-2 text-red-700">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-shield-off"><path d="M19.69 14a6.9 6.9 0 0 0 .31-2V5l-8-3-3.16 1.18" /><path d="M4.73 4.73 4 5v7c0 6 8 10 8 10a20.29 20.29 0 0 0 5.62-4.38" /><path d="M1 1 23 23" /></svg>
                          <span className="text-sm">Not enabled - Strongly recommended</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-gray-700 border-b pb-2">Login Activity</h3>

                  <div className="space-y-6">
                    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                      <div className="p-4 flex justify-between items-center">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-green-100 rounded-full mt-1">
                            <Clock size={18} className="text-green-600" />
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-800">Active Sessions</h3>
                            <p className="text-sm text-gray-500">Manage your active login sessions</p>
                          </div>
                        </div>
                        <Button variant="outline" className="bg-white hover:bg-gray-50 border-gray-200">
                          View Sessions
                        </Button>
                      </div>
                      <div className="border-t border-gray-100">
                        <div className="p-3 flex items-center justify-between bg-gray-50">
                          <div className="flex items-center gap-2">
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600"><rect width="16" height="10" x="4" y="2" rx="2" /><path d="M12 16v4" /><path d="M8 20h8" /></svg>
                            <span className="text-sm font-medium text-gray-700">Current Device</span>
                            <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>
                          </div>
                          <span className="text-xs text-gray-500">Started 2 hours ago</span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
                      <div className="p-4 flex justify-between items-center">
                        <div className="flex items-start gap-3">
                          <div className="p-2 bg-orange-100 rounded-full mt-1">
                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-orange-600"><path d="M12 22s8-4 8-10V7.5L12 2 4 7.5V12c0 6 8 10 8 10" /><path d="m4.9 16.1 3.8-1.6a2 2 0 0 1 1.6 0l5.4 2.4" /><path d="M8.8 12.6 5 14.2" /><path d="M15 13.4 19 12" /></svg>
                          </div>
                          <div>
                            <h3 className="font-medium text-gray-800">Login Notifications</h3>
                            <p className="text-sm text-gray-500">Get alerted about new logins</p>
                          </div>
                        </div>
                        <div className="flex items-center">
                          <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" value="" className="sr-only peer" checked />
                            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-100 pt-6">
                <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                  <div className="flex gap-4">
                    <div className="p-3 bg-blue-100 rounded-full">
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" /><path d="M12 8v4" /><path d="M12 16h.01" /></svg>
                    </div>
                    <div>
                      <h3 className="text-lg font-medium text-blue-800 mb-1">Security Recommendations</h3>
                      <p className="text-blue-700 mb-3">Enhance your account security by completing these recommendations:</p>
                      <ul className="space-y-2">
                        <li className="flex items-center gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600"><circle cx="12" cy="12" r="10" /><path d="m15 9-6 6" /><path d="m9 9 6 6" /></svg>
                          <span className="text-blue-700">Enable two-factor authentication</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600"><circle cx="12" cy="12" r="10" /><path d="m15 9-6 6" /><path d="m9 9 6 6" /></svg>
                          <span className="text-blue-700">Update your password (last changed: never)</span>
                        </li>
                        <li className="flex items-center gap-2">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-green-600"><circle cx="12" cy="12" r="10" /><path d="m9 12 2 2 4-4" /></svg>
                          <span className="text-blue-700">Email verification complete</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="preferences">
          <Card>
            <CardHeader>
              <CardTitle>User Preferences</CardTitle>
              <CardDescription>
                Customize your account preferences and notifications
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="space-y-2">
                  <h3 className="font-medium">Email Notifications</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="order-updates" className="rounded" />
                      <label htmlFor="order-updates">Order updates</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="payment-confirmations" className="rounded" />
                      <label htmlFor="payment-confirmations">Payment confirmations</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="promotional-emails" className="rounded" />
                      <label htmlFor="promotional-emails">Promotional emails</label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="account-activity" className="rounded" />
                      <label htmlFor="account-activity">Account activity</label>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="font-medium">Language & Region</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label htmlFor="language" className="text-sm text-gray-500">Language</label>
                      <Select defaultValue="en">
                        <SelectTrigger id="language">
                          <SelectValue placeholder="Select language" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="en">English</SelectItem>
                          <SelectItem value="fr">French</SelectItem>
                          <SelectItem value="es">Spanish</SelectItem>
                          <SelectItem value="de">German</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-1">
                      <label htmlFor="timezone" className="text-sm text-gray-500">Timezone</label>
                      <Select defaultValue="utc">
                        <SelectTrigger id="timezone">
                          <SelectValue placeholder="Select timezone" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="utc">UTC (GMT+0)</SelectItem>
                          <SelectItem value="est">Eastern Time (GMT-5)</SelectItem>
                          <SelectItem value="pst">Pacific Time (GMT-8)</SelectItem>
                          <SelectItem value="cet">Central European Time (GMT+1)</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button>Save Preferences</Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function PaymentMethodsTab() {
  const [isAddCardModalOpen, setIsAddCardModalOpen] = useState(false);
  const [selectedCard, setSelectedCard] = useState<string | null>(null);

  const paymentMethods = [
    {
      id: "card1",
      name: "Visa",
      cardNumber: "**** **** **** 1234",
      provider: "Visa",
      expiryDate: "12/24",
      cardType: "credit",
      isDefault: true,
      lastUsed: "2024-02-15"
    },
    {
      id: "card2",
      name: "Mastercard",
      cardNumber: "**** **** **** 5678",
      provider: "Mastercard",
      expiryDate: "09/25",
      cardType: "debit",
      isDefault: false,
      lastUsed: "2024-01-20"
    },
  ];

  const PaymentMethodCard = ({
    id,
    name,
    cardNumber,
    provider,
    expiryDate,
    cardType,
    isDefault,
    lastUsed,
  }: {
    id: string;
    name: string;
    cardNumber: string;
    provider: string;
    expiryDate: string;
    cardType: string;
    isDefault: boolean;
    lastUsed: string;
  }) => {
    const [showActions, setShowActions] = useState(false);

    return (
      <div
        className={`relative group bg-white rounded-xl border ${selectedCard === id ? 'border-blue-500 ring-2 ring-blue-100' : 'border-gray-200'
          } shadow-sm hover:shadow-md transition-all duration-200`}
        onClick={() => setSelectedCard(id)}
      >
        <div className="absolute top-4 right-4 flex items-center gap-2">
          {isDefault && (
            <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">
              Default
            </Badge>
          )}
          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              className="p-1.5 hover:bg-gray-100 rounded-full transition-colors"
              onClick={(e) => {
                e.stopPropagation();
                setShowActions(!showActions);
              }}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-500"><circle cx="12" cy="12" r="1" /><circle cx="19" cy="12" r="1" /><circle cx="5" cy="12" r="1" /></svg>
            </button>
            {showActions && (
              <div className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-10">
                <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 text-gray-700">
                  Set as Default
                </button>
                <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 text-gray-700">
                  Edit Card
                </button>
                <button className="w-full px-4 py-2 text-left text-sm hover:bg-gray-50 text-red-600">
                  Remove Card
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-3">
              {provider === "Visa" ? (
                <div className="w-12 h-8 bg-blue-600 rounded-md flex items-center justify-center text-white font-bold text-lg">
                  VISA
                </div>
              ) : (
                <div className="w-12 h-8 bg-orange-600 rounded-md flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-white"><circle cx="12" cy="12" r="10" /><path d="M2 12h20" /></svg>
                </div>
              )}
              <div>
                <h3 className="font-semibold text-gray-800">{name}</h3>
                <p className="text-sm text-gray-500 capitalize">{cardType}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-2xl font-medium text-gray-800 font-mono tracking-wider">
                {cardNumber}
              </p>
            </div>

            <div className="flex justify-between items-end">
              <div>
                <p className="text-xs text-gray-500">Expires</p>
                <p className="font-medium text-gray-700">{expiryDate}</p>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500">Last used</p>
                <p className="text-sm text-gray-600">
                  {new Date(lastUsed).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const AddNewCardButton = () => (
    <button
      onClick={() => setIsAddCardModalOpen(true)}
      className="relative h-full w-full bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 group"
    >
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="p-4 bg-white rounded-full shadow-sm group-hover:scale-110 transition-transform duration-200">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600"><path d="M5 12h14" /><path d="M12 5v14" /></svg>
        </div>
        <div className="mt-4 text-center">
          <h3 className="font-medium text-gray-800 group-hover:text-blue-600">Add New Card</h3>
          <p className="text-sm text-gray-500 mt-1 max-w-[200px]">
            Add a new credit or debit card to your account
          </p>
        </div>
      </div>
    </button>
  );

  return (
    <div className="w-[95%] mx-auto mt-8">
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Payment Methods</h2>
              <p className="text-gray-500 mt-1">Manage your saved payment methods</p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" className="gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" /><polyline points="17 8 12 3 7 8" /><line x1="12" y1="3" x2="12" y2="15" /></svg>
                Export Cards
              </Button>
              <Button className="gap-2" onClick={() => setIsAddCardModalOpen(true)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="M12 5v14" /></svg>
                Add New Card
              </Button>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" /><polyline points="22 4 12 14.01 9 11.01" /></svg>
              <span className="text-sm text-blue-700">Your payment information is securely stored</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-lg">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-gray-600"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" /></svg>
              <span className="text-sm text-gray-600">You can add up to 5 cards</span>
            </div>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {paymentMethods.map((method) => (
              <PaymentMethodCard key={method.id} {...method} />
            ))}
            <div className="h-[250px]">
              <AddNewCardButton />
            </div>
          </div>
        </div>
      </div>

      {/* Add Card Modal */}
      {isAddCardModalOpen && (
        <AddCardModal
          open={isAddCardModalOpen}
          onClose={() => setIsAddCardModalOpen(false)}
        />
      )}
    </div>
  );
}

function TransactionsTab() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  return (
    <div className="w-[95%] mx-auto bg-white mt-8 rounded-lg p-6 shadow-sm">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Transaction History</h2>
          <p className="text-gray-500">View and manage your payment transactions</p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <Input
            placeholder="Search by transaction ID, customer name or email"
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex gap-2">
          <div className="w-40">
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <div className="flex items-center">
                  <Filter size={16} className="mr-2" />
                  <SelectValue placeholder="Status" />
                </div>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="failed">Failed</SelectItem>
                <SelectItem value="refunded">Refunded</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="w-40">
            <div className="relative">
              <Calendar size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="date"
                placeholder="Start Date"
                className="pl-10"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
          </div>

          <div className="w-40">
            <div className="relative">
              <Calendar size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="date"
                placeholder="End Date"
                className="pl-10"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="text-center py-16 border-2 border-dashed border-gray-200 rounded-lg">
        <div className="inline-block p-4 bg-blue-50 rounded-full mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-500"><path d="M12 20h9" /><path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" /></svg>
        </div>
        <h3 className="text-xl font-medium text-gray-800 mb-2">Transaction History Coming Soon</h3>
        <p className="text-gray-500 max-w-md mx-auto">
          We're currently developing this feature to provide you with a comprehensive view of your payment transactions. Check back soon!
        </p>
        <Button variant="outline" className="mt-4">
          Notify Me When Available
        </Button>
      </div>
    </div>
  );
}
